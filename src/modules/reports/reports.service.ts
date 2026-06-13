
import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { CACHE_MANAGER }
  from '@nestjs/cache-manager';

import type { Cache } from 'cache-manager';

import { DataSource } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    private dataSource: DataSource,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async getProfitLossReport(
    tenantId: string,
  ) {

    /*
      CACHE KEY
    */

    const cacheKey =
      `profit-loss-${tenantId}`;

    /*
      CHECK REDIS CACHE
    */

    const cachedData =
      await this.cacheManager.get(
        cacheKey,
      );

    if (cachedData) {

      console.log(
        'Serving Profit/Loss from Redis Cache',
      );

      return cachedData;
    }

    /*
      RUN DATABASE QUERY
    */

    const result =
      await this.dataSource.query(
        `

      WITH monthly_summary AS (

          SELECT 

              DATE_TRUNC('month', t.date) AS month,

              SUM(
                  CASE
                      WHEN
                          a_from.type = 'income'
                          OR
                          a_to.type = 'income'

                      THEN t.amount

                      ELSE 0
                  END
              ) AS income,

              SUM(
                  CASE
                      WHEN
                          a_from.type = 'expense'
                          OR
                          a_to.type = 'expense'

                      THEN t.amount

                      ELSE 0
                  END
              ) AS expense

          FROM transactions t

          LEFT JOIN accounts a_from
              ON t.from_account_id = a_from.id

          LEFT JOIN accounts a_to
              ON t.to_account_id = a_to.id

          WHERE t.tenant_id = $1

          GROUP BY 1
      )

      SELECT *,

          income - expense AS net_profit

      FROM monthly_summary

      ORDER BY month;


        `,
        [tenantId],
      );

    /*
      STORE IN REDIS
    */

    await this.cacheManager.set(
      cacheKey,
      result,
      60000,
    );

    return result;
  }

  async getRunningBalance(
    accountId: string,
    tenantId: string,
  ) {

    /*
      CACHE KEY
    */

    const cacheKey =
      `running-balance-${accountId}-${tenantId}`;

    /*
      CHECK REDIS CACHE
    */

    const cachedData =
      await this.cacheManager.get(
        cacheKey,
      );

    if (cachedData) {

      console.log(
        'Serving Running Balance from Redis Cache',
      );

      return cachedData;
    }

    /*
      RUN DATABASE QUERY
    */



    const result =
      await this.dataSource.query(
        `
    /*
      GET INITIAL ACCOUNT BALANCE
    */

    WITH account_info AS (

      SELECT

        id,

        balance AS current_balance

      FROM accounts

      WHERE
        id = $1
        AND tenant_id = $2
    ),

    /*
      ALL TRANSACTIONS RELATED
      TO THIS ACCOUNT
    */

    account_transactions AS (

      SELECT

        t.id,

        t.description,

        t.date,

        CASE

          /*
            MONEY RECEIVED
          */

          WHEN t.to_account_id = $1
          THEN t.amount

          /*
            MONEY SENT
          */

          WHEN t.from_account_id = $1
          THEN -t.amount

          ELSE 0

        END AS transaction_amount

      FROM transactions t

      WHERE

        (
          t.to_account_id = $1

          OR

          t.from_account_id = $1
        )

        AND t.tenant_id = $2
    ),

    /*
      CALCULATE TOTAL NET MOVEMENT
    */

    total_movement AS (

      SELECT

        COALESCE(
          SUM(transaction_amount),
          0
        ) AS net_transaction_total

      FROM account_transactions
    ),

    /*
      ESTIMATE OPENING BALANCE
      FROM CURRENT BALANCE
    */

    opening_balance AS (

      SELECT

        ai.current_balance
        -
        tm.net_transaction_total

        AS opening_balance

      FROM account_info ai

      CROSS JOIN total_movement tm
    )

    /*
      FINAL RUNNING BALANCE
    */

    SELECT

      at.id,

      at.description,

      at.date,

      at.transaction_amount,

      ob.opening_balance

      +

      SUM(at.transaction_amount)
      OVER (
        ORDER BY at.date, at.id
      )

      AS running_balance

    FROM account_transactions at

    CROSS JOIN opening_balance ob

    ORDER BY at.date, at.id;
    `,
        [accountId, tenantId],
      );




    /*
      STORE IN REDIS
    */

    await this.cacheManager.set(
      cacheKey,
      result,
      60000,
    );

    return result;
  }
}

