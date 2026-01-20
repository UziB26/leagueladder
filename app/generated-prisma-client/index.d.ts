
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Player
 * 
 */
export type Player = $Result.DefaultSelection<Prisma.$PlayerPayload>
/**
 * Model League
 * 
 */
export type League = $Result.DefaultSelection<Prisma.$LeaguePayload>
/**
 * Model LeagueMembership
 * 
 */
export type LeagueMembership = $Result.DefaultSelection<Prisma.$LeagueMembershipPayload>
/**
 * Model PlayerRating
 * 
 */
export type PlayerRating = $Result.DefaultSelection<Prisma.$PlayerRatingPayload>
/**
 * Model Challenge
 * 
 */
export type Challenge = $Result.DefaultSelection<Prisma.$ChallengePayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>
/**
 * Model MatchConfirmation
 * 
 */
export type MatchConfirmation = $Result.DefaultSelection<Prisma.$MatchConfirmationPayload>
/**
 * Model RatingUpdate
 * 
 */
export type RatingUpdate = $Result.DefaultSelection<Prisma.$RatingUpdatePayload>
/**
 * Model AdminAction
 * 
 */
export type AdminAction = $Result.DefaultSelection<Prisma.$AdminActionPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.player`: Exposes CRUD operations for the **Player** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Players
    * const players = await prisma.player.findMany()
    * ```
    */
  get player(): Prisma.PlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.league`: Exposes CRUD operations for the **League** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leagues
    * const leagues = await prisma.league.findMany()
    * ```
    */
  get league(): Prisma.LeagueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leagueMembership`: Exposes CRUD operations for the **LeagueMembership** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeagueMemberships
    * const leagueMemberships = await prisma.leagueMembership.findMany()
    * ```
    */
  get leagueMembership(): Prisma.LeagueMembershipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.playerRating`: Exposes CRUD operations for the **PlayerRating** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlayerRatings
    * const playerRatings = await prisma.playerRating.findMany()
    * ```
    */
  get playerRating(): Prisma.PlayerRatingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.challenge`: Exposes CRUD operations for the **Challenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Challenges
    * const challenges = await prisma.challenge.findMany()
    * ```
    */
  get challenge(): Prisma.ChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.matchConfirmation`: Exposes CRUD operations for the **MatchConfirmation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MatchConfirmations
    * const matchConfirmations = await prisma.matchConfirmation.findMany()
    * ```
    */
  get matchConfirmation(): Prisma.MatchConfirmationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ratingUpdate`: Exposes CRUD operations for the **RatingUpdate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RatingUpdates
    * const ratingUpdates = await prisma.ratingUpdate.findMany()
    * ```
    */
  get ratingUpdate(): Prisma.RatingUpdateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.adminAction`: Exposes CRUD operations for the **AdminAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AdminActions
    * const adminActions = await prisma.adminAction.findMany()
    * ```
    */
  get adminAction(): Prisma.AdminActionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Account: 'Account',
    Session: 'Session',
    Player: 'Player',
    League: 'League',
    LeagueMembership: 'LeagueMembership',
    PlayerRating: 'PlayerRating',
    Challenge: 'Challenge',
    Match: 'Match',
    MatchConfirmation: 'MatchConfirmation',
    RatingUpdate: 'RatingUpdate',
    AdminAction: 'AdminAction'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "account" | "session" | "player" | "league" | "leagueMembership" | "playerRating" | "challenge" | "match" | "matchConfirmation" | "ratingUpdate" | "adminAction"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Player: {
        payload: Prisma.$PlayerPayload<ExtArgs>
        fields: Prisma.PlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findFirst: {
            args: Prisma.PlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          findMany: {
            args: Prisma.PlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          create: {
            args: Prisma.PlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          createMany: {
            args: Prisma.PlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          delete: {
            args: Prisma.PlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          update: {
            args: Prisma.PlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          deleteMany: {
            args: Prisma.PlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>[]
          }
          upsert: {
            args: Prisma.PlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerPayload>
          }
          aggregate: {
            args: Prisma.PlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayer>
          }
          groupBy: {
            args: Prisma.PlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerCountAggregateOutputType> | number
          }
        }
      }
      League: {
        payload: Prisma.$LeaguePayload<ExtArgs>
        fields: Prisma.LeagueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeagueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeagueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          findFirst: {
            args: Prisma.LeagueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeagueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          findMany: {
            args: Prisma.LeagueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>[]
          }
          create: {
            args: Prisma.LeagueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          createMany: {
            args: Prisma.LeagueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeagueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>[]
          }
          delete: {
            args: Prisma.LeagueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          update: {
            args: Prisma.LeagueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          deleteMany: {
            args: Prisma.LeagueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeagueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeagueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>[]
          }
          upsert: {
            args: Prisma.LeagueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaguePayload>
          }
          aggregate: {
            args: Prisma.LeagueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeague>
          }
          groupBy: {
            args: Prisma.LeagueGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeagueGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeagueCountArgs<ExtArgs>
            result: $Utils.Optional<LeagueCountAggregateOutputType> | number
          }
        }
      }
      LeagueMembership: {
        payload: Prisma.$LeagueMembershipPayload<ExtArgs>
        fields: Prisma.LeagueMembershipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeagueMembershipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeagueMembershipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          findFirst: {
            args: Prisma.LeagueMembershipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeagueMembershipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          findMany: {
            args: Prisma.LeagueMembershipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>[]
          }
          create: {
            args: Prisma.LeagueMembershipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          createMany: {
            args: Prisma.LeagueMembershipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeagueMembershipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>[]
          }
          delete: {
            args: Prisma.LeagueMembershipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          update: {
            args: Prisma.LeagueMembershipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          deleteMany: {
            args: Prisma.LeagueMembershipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeagueMembershipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeagueMembershipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>[]
          }
          upsert: {
            args: Prisma.LeagueMembershipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeagueMembershipPayload>
          }
          aggregate: {
            args: Prisma.LeagueMembershipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeagueMembership>
          }
          groupBy: {
            args: Prisma.LeagueMembershipGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeagueMembershipGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeagueMembershipCountArgs<ExtArgs>
            result: $Utils.Optional<LeagueMembershipCountAggregateOutputType> | number
          }
        }
      }
      PlayerRating: {
        payload: Prisma.$PlayerRatingPayload<ExtArgs>
        fields: Prisma.PlayerRatingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PlayerRatingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PlayerRatingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          findFirst: {
            args: Prisma.PlayerRatingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PlayerRatingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          findMany: {
            args: Prisma.PlayerRatingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>[]
          }
          create: {
            args: Prisma.PlayerRatingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          createMany: {
            args: Prisma.PlayerRatingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PlayerRatingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>[]
          }
          delete: {
            args: Prisma.PlayerRatingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          update: {
            args: Prisma.PlayerRatingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          deleteMany: {
            args: Prisma.PlayerRatingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PlayerRatingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PlayerRatingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>[]
          }
          upsert: {
            args: Prisma.PlayerRatingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PlayerRatingPayload>
          }
          aggregate: {
            args: Prisma.PlayerRatingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePlayerRating>
          }
          groupBy: {
            args: Prisma.PlayerRatingGroupByArgs<ExtArgs>
            result: $Utils.Optional<PlayerRatingGroupByOutputType>[]
          }
          count: {
            args: Prisma.PlayerRatingCountArgs<ExtArgs>
            result: $Utils.Optional<PlayerRatingCountAggregateOutputType> | number
          }
        }
      }
      Challenge: {
        payload: Prisma.$ChallengePayload<ExtArgs>
        fields: Prisma.ChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          findFirst: {
            args: Prisma.ChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          findMany: {
            args: Prisma.ChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>[]
          }
          create: {
            args: Prisma.ChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          createMany: {
            args: Prisma.ChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>[]
          }
          delete: {
            args: Prisma.ChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          update: {
            args: Prisma.ChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          deleteMany: {
            args: Prisma.ChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>[]
          }
          upsert: {
            args: Prisma.ChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChallengePayload>
          }
          aggregate: {
            args: Prisma.ChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChallenge>
          }
          groupBy: {
            args: Prisma.ChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<ChallengeCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
      MatchConfirmation: {
        payload: Prisma.$MatchConfirmationPayload<ExtArgs>
        fields: Prisma.MatchConfirmationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchConfirmationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchConfirmationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          findFirst: {
            args: Prisma.MatchConfirmationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchConfirmationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          findMany: {
            args: Prisma.MatchConfirmationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>[]
          }
          create: {
            args: Prisma.MatchConfirmationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          createMany: {
            args: Prisma.MatchConfirmationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchConfirmationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>[]
          }
          delete: {
            args: Prisma.MatchConfirmationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          update: {
            args: Prisma.MatchConfirmationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          deleteMany: {
            args: Prisma.MatchConfirmationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchConfirmationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchConfirmationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>[]
          }
          upsert: {
            args: Prisma.MatchConfirmationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchConfirmationPayload>
          }
          aggregate: {
            args: Prisma.MatchConfirmationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatchConfirmation>
          }
          groupBy: {
            args: Prisma.MatchConfirmationGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchConfirmationGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchConfirmationCountArgs<ExtArgs>
            result: $Utils.Optional<MatchConfirmationCountAggregateOutputType> | number
          }
        }
      }
      RatingUpdate: {
        payload: Prisma.$RatingUpdatePayload<ExtArgs>
        fields: Prisma.RatingUpdateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RatingUpdateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RatingUpdateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          findFirst: {
            args: Prisma.RatingUpdateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RatingUpdateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          findMany: {
            args: Prisma.RatingUpdateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>[]
          }
          create: {
            args: Prisma.RatingUpdateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          createMany: {
            args: Prisma.RatingUpdateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RatingUpdateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>[]
          }
          delete: {
            args: Prisma.RatingUpdateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          update: {
            args: Prisma.RatingUpdateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          deleteMany: {
            args: Prisma.RatingUpdateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RatingUpdateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RatingUpdateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>[]
          }
          upsert: {
            args: Prisma.RatingUpdateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RatingUpdatePayload>
          }
          aggregate: {
            args: Prisma.RatingUpdateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRatingUpdate>
          }
          groupBy: {
            args: Prisma.RatingUpdateGroupByArgs<ExtArgs>
            result: $Utils.Optional<RatingUpdateGroupByOutputType>[]
          }
          count: {
            args: Prisma.RatingUpdateCountArgs<ExtArgs>
            result: $Utils.Optional<RatingUpdateCountAggregateOutputType> | number
          }
        }
      }
      AdminAction: {
        payload: Prisma.$AdminActionPayload<ExtArgs>
        fields: Prisma.AdminActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          findFirst: {
            args: Prisma.AdminActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          findMany: {
            args: Prisma.AdminActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>[]
          }
          create: {
            args: Prisma.AdminActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          createMany: {
            args: Prisma.AdminActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminActionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>[]
          }
          delete: {
            args: Prisma.AdminActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          update: {
            args: Prisma.AdminActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          deleteMany: {
            args: Prisma.AdminActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminActionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>[]
          }
          upsert: {
            args: Prisma.AdminActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminActionPayload>
          }
          aggregate: {
            args: Prisma.AdminActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdminAction>
          }
          groupBy: {
            args: Prisma.AdminActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminActionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminActionCountArgs<ExtArgs>
            result: $Utils.Optional<AdminActionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    account?: AccountOmit
    session?: SessionOmit
    player?: PlayerOmit
    league?: LeagueOmit
    leagueMembership?: LeagueMembershipOmit
    playerRating?: PlayerRatingOmit
    challenge?: ChallengeOmit
    match?: MatchOmit
    matchConfirmation?: MatchConfirmationOmit
    ratingUpdate?: RatingUpdateOmit
    adminAction?: AdminActionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    players: number
    adminActions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    players?: boolean | UserCountOutputTypeCountPlayersArgs
    adminActions?: boolean | UserCountOutputTypeCountAdminActionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdminActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminActionWhereInput
  }


  /**
   * Count Type PlayerCountOutputType
   */

  export type PlayerCountOutputType = {
    memberships: number
    ratings: number
    challengesSent: number
    challengesReceived: number
    matchesAsPlayer1: number
    matchesAsPlayer2: number
    matchesWon: number
    matchesReported: number
    matchConfirmations: number
    ratingUpdates: number
  }

  export type PlayerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | PlayerCountOutputTypeCountMembershipsArgs
    ratings?: boolean | PlayerCountOutputTypeCountRatingsArgs
    challengesSent?: boolean | PlayerCountOutputTypeCountChallengesSentArgs
    challengesReceived?: boolean | PlayerCountOutputTypeCountChallengesReceivedArgs
    matchesAsPlayer1?: boolean | PlayerCountOutputTypeCountMatchesAsPlayer1Args
    matchesAsPlayer2?: boolean | PlayerCountOutputTypeCountMatchesAsPlayer2Args
    matchesWon?: boolean | PlayerCountOutputTypeCountMatchesWonArgs
    matchesReported?: boolean | PlayerCountOutputTypeCountMatchesReportedArgs
    matchConfirmations?: boolean | PlayerCountOutputTypeCountMatchConfirmationsArgs
    ratingUpdates?: boolean | PlayerCountOutputTypeCountRatingUpdatesArgs
  }

  // Custom InputTypes
  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerCountOutputType
     */
    select?: PlayerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeagueMembershipWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRatingWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountChallengesSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountChallengesReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMatchesAsPlayer1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMatchesAsPlayer2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMatchesWonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMatchesReportedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountMatchConfirmationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchConfirmationWhereInput
  }

  /**
   * PlayerCountOutputType without action
   */
  export type PlayerCountOutputTypeCountRatingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingUpdateWhereInput
  }


  /**
   * Count Type LeagueCountOutputType
   */

  export type LeagueCountOutputType = {
    memberships: number
    ratings: number
    challenges: number
    matches: number
    ratingUpdates: number
  }

  export type LeagueCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | LeagueCountOutputTypeCountMembershipsArgs
    ratings?: boolean | LeagueCountOutputTypeCountRatingsArgs
    challenges?: boolean | LeagueCountOutputTypeCountChallengesArgs
    matches?: boolean | LeagueCountOutputTypeCountMatchesArgs
    ratingUpdates?: boolean | LeagueCountOutputTypeCountRatingUpdatesArgs
  }

  // Custom InputTypes
  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueCountOutputType
     */
    select?: LeagueCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeCountMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeagueMembershipWhereInput
  }

  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeCountRatingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRatingWhereInput
  }

  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeCountChallengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeWhereInput
  }

  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeCountMatchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * LeagueCountOutputType without action
   */
  export type LeagueCountOutputTypeCountRatingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingUpdateWhereInput
  }


  /**
   * Count Type MatchCountOutputType
   */

  export type MatchCountOutputType = {
    confirmations: number
    ratingUpdates: number
  }

  export type MatchCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    confirmations?: boolean | MatchCountOutputTypeCountConfirmationsArgs
    ratingUpdates?: boolean | MatchCountOutputTypeCountRatingUpdatesArgs
  }

  // Custom InputTypes
  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchCountOutputType
     */
    select?: MatchCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountConfirmationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchConfirmationWhereInput
  }

  /**
   * MatchCountOutputType without action
   */
  export type MatchCountOutputTypeCountRatingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingUpdateWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    isAdmin: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    isAdmin: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    isAdmin?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    image: string | null
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    players?: boolean | User$playersArgs<ExtArgs>
    adminActions?: boolean | User$adminActionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    isAdmin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "emailVerified" | "image" | "isAdmin" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    players?: boolean | User$playersArgs<ExtArgs>
    adminActions?: boolean | User$adminActionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      players: Prisma.$PlayerPayload<ExtArgs>[]
      adminActions: Prisma.$AdminActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string
      emailVerified: Date | null
      image: string | null
      isAdmin: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    players<T extends User$playersArgs<ExtArgs> = {}>(args?: Subset<T, User$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    adminActions<T extends User$adminActionsArgs<ExtArgs> = {}>(args?: Subset<T, User$adminActionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
    readonly isAdmin: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.players
   */
  export type User$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    cursor?: PlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * User.adminActions
   */
  export type User$adminActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    where?: AdminActionWhereInput
    orderBy?: AdminActionOrderByWithRelationInput | AdminActionOrderByWithRelationInput[]
    cursor?: AdminActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AdminActionScalarFieldEnum | AdminActionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expiresAt: number | null
  }

  export type AccountSumAggregateOutputType = {
    expiresAt: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refreshToken: number
    accessToken: number
    expiresAt: number
    tokenType: number
    scope: number
    idToken: number
    sessionState: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expiresAt?: true
  }

  export type AccountSumAggregateInputType = {
    expiresAt?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refreshToken" | "accessToken" | "expiresAt" | "tokenType" | "scope" | "idToken" | "sessionState", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refreshToken: string | null
      accessToken: string | null
      expiresAt: number | null
      tokenType: string | null
      scope: string | null
      idToken: string | null
      sessionState: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly expiresAt: FieldRef<"Account", 'Int'>
    readonly tokenType: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly sessionState: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Player
   */

  export type AggregatePlayer = {
    _count: PlayerCountAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  export type PlayerMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    avatar: string | null
    createdAt: Date | null
  }

  export type PlayerMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    email: string | null
    avatar: string | null
    createdAt: Date | null
  }

  export type PlayerCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    email: number
    avatar: number
    createdAt: number
    _all: number
  }


  export type PlayerMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    avatar?: true
    createdAt?: true
  }

  export type PlayerMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    avatar?: true
    createdAt?: true
  }

  export type PlayerCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    email?: true
    avatar?: true
    createdAt?: true
    _all?: true
  }

  export type PlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Player to aggregate.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Players
    **/
    _count?: true | PlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerMaxAggregateInputType
  }

  export type GetPlayerAggregateType<T extends PlayerAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayer[P]>
      : GetScalarType<T[P], AggregatePlayer[P]>
  }




  export type PlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerWhereInput
    orderBy?: PlayerOrderByWithAggregationInput | PlayerOrderByWithAggregationInput[]
    by: PlayerScalarFieldEnum[] | PlayerScalarFieldEnum
    having?: PlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerCountAggregateInputType | true
    _min?: PlayerMinAggregateInputType
    _max?: PlayerMaxAggregateInputType
  }

  export type PlayerGroupByOutputType = {
    id: string
    userId: string
    name: string
    email: string | null
    avatar: string | null
    createdAt: Date
    _count: PlayerCountAggregateOutputType | null
    _min: PlayerMinAggregateOutputType | null
    _max: PlayerMaxAggregateOutputType | null
  }

  type GetPlayerGroupByPayload<T extends PlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerGroupByOutputType[P]>
        }
      >
    >


  export type PlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    avatar?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    memberships?: boolean | Player$membershipsArgs<ExtArgs>
    ratings?: boolean | Player$ratingsArgs<ExtArgs>
    challengesSent?: boolean | Player$challengesSentArgs<ExtArgs>
    challengesReceived?: boolean | Player$challengesReceivedArgs<ExtArgs>
    matchesAsPlayer1?: boolean | Player$matchesAsPlayer1Args<ExtArgs>
    matchesAsPlayer2?: boolean | Player$matchesAsPlayer2Args<ExtArgs>
    matchesWon?: boolean | Player$matchesWonArgs<ExtArgs>
    matchesReported?: boolean | Player$matchesReportedArgs<ExtArgs>
    matchConfirmations?: boolean | Player$matchConfirmationsArgs<ExtArgs>
    ratingUpdates?: boolean | Player$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    avatar?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    avatar?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["player"]>

  export type PlayerSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    email?: boolean
    avatar?: boolean
    createdAt?: boolean
  }

  export type PlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "email" | "avatar" | "createdAt", ExtArgs["result"]["player"]>
  export type PlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    memberships?: boolean | Player$membershipsArgs<ExtArgs>
    ratings?: boolean | Player$ratingsArgs<ExtArgs>
    challengesSent?: boolean | Player$challengesSentArgs<ExtArgs>
    challengesReceived?: boolean | Player$challengesReceivedArgs<ExtArgs>
    matchesAsPlayer1?: boolean | Player$matchesAsPlayer1Args<ExtArgs>
    matchesAsPlayer2?: boolean | Player$matchesAsPlayer2Args<ExtArgs>
    matchesWon?: boolean | Player$matchesWonArgs<ExtArgs>
    matchesReported?: boolean | Player$matchesReportedArgs<ExtArgs>
    matchConfirmations?: boolean | Player$matchConfirmationsArgs<ExtArgs>
    ratingUpdates?: boolean | Player$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | PlayerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Player"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      memberships: Prisma.$LeagueMembershipPayload<ExtArgs>[]
      ratings: Prisma.$PlayerRatingPayload<ExtArgs>[]
      challengesSent: Prisma.$ChallengePayload<ExtArgs>[]
      challengesReceived: Prisma.$ChallengePayload<ExtArgs>[]
      matchesAsPlayer1: Prisma.$MatchPayload<ExtArgs>[]
      matchesAsPlayer2: Prisma.$MatchPayload<ExtArgs>[]
      matchesWon: Prisma.$MatchPayload<ExtArgs>[]
      matchesReported: Prisma.$MatchPayload<ExtArgs>[]
      matchConfirmations: Prisma.$MatchConfirmationPayload<ExtArgs>[]
      ratingUpdates: Prisma.$RatingUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      email: string | null
      avatar: string | null
      createdAt: Date
    }, ExtArgs["result"]["player"]>
    composites: {}
  }

  type PlayerGetPayload<S extends boolean | null | undefined | PlayerDefaultArgs> = $Result.GetResult<Prisma.$PlayerPayload, S>

  type PlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerCountAggregateInputType | true
    }

  export interface PlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Player'], meta: { name: 'Player' } }
    /**
     * Find zero or one Player that matches the filter.
     * @param {PlayerFindUniqueArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerFindUniqueArgs>(args: SelectSubset<T, PlayerFindUniqueArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Player that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerFindUniqueOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerFindFirstArgs>(args?: SelectSubset<T, PlayerFindFirstArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Player that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindFirstOrThrowArgs} args - Arguments to find a Player
     * @example
     * // Get one Player
     * const player = await prisma.player.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Players that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Players
     * const players = await prisma.player.findMany()
     * 
     * // Get first 10 Players
     * const players = await prisma.player.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerWithIdOnly = await prisma.player.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerFindManyArgs>(args?: SelectSubset<T, PlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Player.
     * @param {PlayerCreateArgs} args - Arguments to create a Player.
     * @example
     * // Create one Player
     * const Player = await prisma.player.create({
     *   data: {
     *     // ... data to create a Player
     *   }
     * })
     * 
     */
    create<T extends PlayerCreateArgs>(args: SelectSubset<T, PlayerCreateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Players.
     * @param {PlayerCreateManyArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerCreateManyArgs>(args?: SelectSubset<T, PlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Players and returns the data saved in the database.
     * @param {PlayerCreateManyAndReturnArgs} args - Arguments to create many Players.
     * @example
     * // Create many Players
     * const player = await prisma.player.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Player.
     * @param {PlayerDeleteArgs} args - Arguments to delete one Player.
     * @example
     * // Delete one Player
     * const Player = await prisma.player.delete({
     *   where: {
     *     // ... filter to delete one Player
     *   }
     * })
     * 
     */
    delete<T extends PlayerDeleteArgs>(args: SelectSubset<T, PlayerDeleteArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Player.
     * @param {PlayerUpdateArgs} args - Arguments to update one Player.
     * @example
     * // Update one Player
     * const player = await prisma.player.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerUpdateArgs>(args: SelectSubset<T, PlayerUpdateArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Players.
     * @param {PlayerDeleteManyArgs} args - Arguments to filter Players to delete.
     * @example
     * // Delete a few Players
     * const { count } = await prisma.player.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerDeleteManyArgs>(args?: SelectSubset<T, PlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerUpdateManyArgs>(args: SelectSubset<T, PlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Players and returns the data updated in the database.
     * @param {PlayerUpdateManyAndReturnArgs} args - Arguments to update many Players.
     * @example
     * // Update many Players
     * const player = await prisma.player.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Players and only return the `id`
     * const playerWithIdOnly = await prisma.player.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Player.
     * @param {PlayerUpsertArgs} args - Arguments to update or create a Player.
     * @example
     * // Update or create a Player
     * const player = await prisma.player.upsert({
     *   create: {
     *     // ... data to create a Player
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Player we want to update
     *   }
     * })
     */
    upsert<T extends PlayerUpsertArgs>(args: SelectSubset<T, PlayerUpsertArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Players.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerCountArgs} args - Arguments to filter Players to count.
     * @example
     * // Count the number of Players
     * const count = await prisma.player.count({
     *   where: {
     *     // ... the filter for the Players we want to count
     *   }
     * })
    **/
    count<T extends PlayerCountArgs>(
      args?: Subset<T, PlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerAggregateArgs>(args: Subset<T, PlayerAggregateArgs>): Prisma.PrismaPromise<GetPlayerAggregateType<T>>

    /**
     * Group by Player.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerGroupByArgs['orderBy'] }
        : { orderBy?: PlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Player model
   */
  readonly fields: PlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Player.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    memberships<T extends Player$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, Player$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratings<T extends Player$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, Player$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    challengesSent<T extends Player$challengesSentArgs<ExtArgs> = {}>(args?: Subset<T, Player$challengesSentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    challengesReceived<T extends Player$challengesReceivedArgs<ExtArgs> = {}>(args?: Subset<T, Player$challengesReceivedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchesAsPlayer1<T extends Player$matchesAsPlayer1Args<ExtArgs> = {}>(args?: Subset<T, Player$matchesAsPlayer1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchesAsPlayer2<T extends Player$matchesAsPlayer2Args<ExtArgs> = {}>(args?: Subset<T, Player$matchesAsPlayer2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchesWon<T extends Player$matchesWonArgs<ExtArgs> = {}>(args?: Subset<T, Player$matchesWonArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchesReported<T extends Player$matchesReportedArgs<ExtArgs> = {}>(args?: Subset<T, Player$matchesReportedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matchConfirmations<T extends Player$matchConfirmationsArgs<ExtArgs> = {}>(args?: Subset<T, Player$matchConfirmationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratingUpdates<T extends Player$ratingUpdatesArgs<ExtArgs> = {}>(args?: Subset<T, Player$ratingUpdatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Player model
   */
  interface PlayerFieldRefs {
    readonly id: FieldRef<"Player", 'String'>
    readonly userId: FieldRef<"Player", 'String'>
    readonly name: FieldRef<"Player", 'String'>
    readonly email: FieldRef<"Player", 'String'>
    readonly avatar: FieldRef<"Player", 'String'>
    readonly createdAt: FieldRef<"Player", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Player findUnique
   */
  export type PlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findUniqueOrThrow
   */
  export type PlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player findFirst
   */
  export type PlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findFirstOrThrow
   */
  export type PlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Player to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Players.
     */
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player findMany
   */
  export type PlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter, which Players to fetch.
     */
    where?: PlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Players to fetch.
     */
    orderBy?: PlayerOrderByWithRelationInput | PlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Players.
     */
    cursor?: PlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Players from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Players.
     */
    skip?: number
    distinct?: PlayerScalarFieldEnum | PlayerScalarFieldEnum[]
  }

  /**
   * Player create
   */
  export type PlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a Player.
     */
    data: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
  }

  /**
   * Player createMany
   */
  export type PlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Player createManyAndReturn
   */
  export type PlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to create many Players.
     */
    data: PlayerCreateManyInput | PlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player update
   */
  export type PlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a Player.
     */
    data: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
    /**
     * Choose, which Player to update.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player updateMany
   */
  export type PlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
  }

  /**
   * Player updateManyAndReturn
   */
  export type PlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * The data used to update Players.
     */
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyInput>
    /**
     * Filter which Players to update
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Player upsert
   */
  export type PlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the Player to update in case it exists.
     */
    where: PlayerWhereUniqueInput
    /**
     * In case the Player found by the `where` argument doesn't exist, create a new Player with this data.
     */
    create: XOR<PlayerCreateInput, PlayerUncheckedCreateInput>
    /**
     * In case the Player was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerUpdateInput, PlayerUncheckedUpdateInput>
  }

  /**
   * Player delete
   */
  export type PlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    /**
     * Filter which Player to delete.
     */
    where: PlayerWhereUniqueInput
  }

  /**
   * Player deleteMany
   */
  export type PlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Players to delete
     */
    where?: PlayerWhereInput
    /**
     * Limit how many Players to delete.
     */
    limit?: number
  }

  /**
   * Player.memberships
   */
  export type Player$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    where?: LeagueMembershipWhereInput
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    cursor?: LeagueMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeagueMembershipScalarFieldEnum | LeagueMembershipScalarFieldEnum[]
  }

  /**
   * Player.ratings
   */
  export type Player$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    where?: PlayerRatingWhereInput
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    cursor?: PlayerRatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerRatingScalarFieldEnum | PlayerRatingScalarFieldEnum[]
  }

  /**
   * Player.challengesSent
   */
  export type Player$challengesSentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    where?: ChallengeWhereInput
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    cursor?: ChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * Player.challengesReceived
   */
  export type Player$challengesReceivedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    where?: ChallengeWhereInput
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    cursor?: ChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * Player.matchesAsPlayer1
   */
  export type Player$matchesAsPlayer1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Player.matchesAsPlayer2
   */
  export type Player$matchesAsPlayer2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Player.matchesWon
   */
  export type Player$matchesWonArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Player.matchesReported
   */
  export type Player$matchesReportedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Player.matchConfirmations
   */
  export type Player$matchConfirmationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    where?: MatchConfirmationWhereInput
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    cursor?: MatchConfirmationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchConfirmationScalarFieldEnum | MatchConfirmationScalarFieldEnum[]
  }

  /**
   * Player.ratingUpdates
   */
  export type Player$ratingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    where?: RatingUpdateWhereInput
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    cursor?: RatingUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * Player without action
   */
  export type PlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
  }


  /**
   * Model League
   */

  export type AggregateLeague = {
    _count: LeagueCountAggregateOutputType | null
    _min: LeagueMinAggregateOutputType | null
    _max: LeagueMaxAggregateOutputType | null
  }

  export type LeagueMinAggregateOutputType = {
    id: string | null
    name: string | null
    gameType: string | null
    createdAt: Date | null
  }

  export type LeagueMaxAggregateOutputType = {
    id: string | null
    name: string | null
    gameType: string | null
    createdAt: Date | null
  }

  export type LeagueCountAggregateOutputType = {
    id: number
    name: number
    gameType: number
    createdAt: number
    _all: number
  }


  export type LeagueMinAggregateInputType = {
    id?: true
    name?: true
    gameType?: true
    createdAt?: true
  }

  export type LeagueMaxAggregateInputType = {
    id?: true
    name?: true
    gameType?: true
    createdAt?: true
  }

  export type LeagueCountAggregateInputType = {
    id?: true
    name?: true
    gameType?: true
    createdAt?: true
    _all?: true
  }

  export type LeagueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which League to aggregate.
     */
    where?: LeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leagues to fetch.
     */
    orderBy?: LeagueOrderByWithRelationInput | LeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leagues
    **/
    _count?: true | LeagueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeagueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeagueMaxAggregateInputType
  }

  export type GetLeagueAggregateType<T extends LeagueAggregateArgs> = {
        [P in keyof T & keyof AggregateLeague]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeague[P]>
      : GetScalarType<T[P], AggregateLeague[P]>
  }




  export type LeagueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeagueWhereInput
    orderBy?: LeagueOrderByWithAggregationInput | LeagueOrderByWithAggregationInput[]
    by: LeagueScalarFieldEnum[] | LeagueScalarFieldEnum
    having?: LeagueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeagueCountAggregateInputType | true
    _min?: LeagueMinAggregateInputType
    _max?: LeagueMaxAggregateInputType
  }

  export type LeagueGroupByOutputType = {
    id: string
    name: string
    gameType: string
    createdAt: Date
    _count: LeagueCountAggregateOutputType | null
    _min: LeagueMinAggregateOutputType | null
    _max: LeagueMaxAggregateOutputType | null
  }

  type GetLeagueGroupByPayload<T extends LeagueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeagueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeagueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeagueGroupByOutputType[P]>
            : GetScalarType<T[P], LeagueGroupByOutputType[P]>
        }
      >
    >


  export type LeagueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gameType?: boolean
    createdAt?: boolean
    memberships?: boolean | League$membershipsArgs<ExtArgs>
    ratings?: boolean | League$ratingsArgs<ExtArgs>
    challenges?: boolean | League$challengesArgs<ExtArgs>
    matches?: boolean | League$matchesArgs<ExtArgs>
    ratingUpdates?: boolean | League$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | LeagueCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["league"]>

  export type LeagueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gameType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["league"]>

  export type LeagueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gameType?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["league"]>

  export type LeagueSelectScalar = {
    id?: boolean
    name?: boolean
    gameType?: boolean
    createdAt?: boolean
  }

  export type LeagueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "gameType" | "createdAt", ExtArgs["result"]["league"]>
  export type LeagueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    memberships?: boolean | League$membershipsArgs<ExtArgs>
    ratings?: boolean | League$ratingsArgs<ExtArgs>
    challenges?: boolean | League$challengesArgs<ExtArgs>
    matches?: boolean | League$matchesArgs<ExtArgs>
    ratingUpdates?: boolean | League$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | LeagueCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeagueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LeagueIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LeaguePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "League"
    objects: {
      memberships: Prisma.$LeagueMembershipPayload<ExtArgs>[]
      ratings: Prisma.$PlayerRatingPayload<ExtArgs>[]
      challenges: Prisma.$ChallengePayload<ExtArgs>[]
      matches: Prisma.$MatchPayload<ExtArgs>[]
      ratingUpdates: Prisma.$RatingUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      gameType: string
      createdAt: Date
    }, ExtArgs["result"]["league"]>
    composites: {}
  }

  type LeagueGetPayload<S extends boolean | null | undefined | LeagueDefaultArgs> = $Result.GetResult<Prisma.$LeaguePayload, S>

  type LeagueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeagueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeagueCountAggregateInputType | true
    }

  export interface LeagueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['League'], meta: { name: 'League' } }
    /**
     * Find zero or one League that matches the filter.
     * @param {LeagueFindUniqueArgs} args - Arguments to find a League
     * @example
     * // Get one League
     * const league = await prisma.league.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeagueFindUniqueArgs>(args: SelectSubset<T, LeagueFindUniqueArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one League that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeagueFindUniqueOrThrowArgs} args - Arguments to find a League
     * @example
     * // Get one League
     * const league = await prisma.league.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeagueFindUniqueOrThrowArgs>(args: SelectSubset<T, LeagueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first League that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueFindFirstArgs} args - Arguments to find a League
     * @example
     * // Get one League
     * const league = await prisma.league.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeagueFindFirstArgs>(args?: SelectSubset<T, LeagueFindFirstArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first League that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueFindFirstOrThrowArgs} args - Arguments to find a League
     * @example
     * // Get one League
     * const league = await prisma.league.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeagueFindFirstOrThrowArgs>(args?: SelectSubset<T, LeagueFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leagues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leagues
     * const leagues = await prisma.league.findMany()
     * 
     * // Get first 10 Leagues
     * const leagues = await prisma.league.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leagueWithIdOnly = await prisma.league.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeagueFindManyArgs>(args?: SelectSubset<T, LeagueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a League.
     * @param {LeagueCreateArgs} args - Arguments to create a League.
     * @example
     * // Create one League
     * const League = await prisma.league.create({
     *   data: {
     *     // ... data to create a League
     *   }
     * })
     * 
     */
    create<T extends LeagueCreateArgs>(args: SelectSubset<T, LeagueCreateArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leagues.
     * @param {LeagueCreateManyArgs} args - Arguments to create many Leagues.
     * @example
     * // Create many Leagues
     * const league = await prisma.league.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeagueCreateManyArgs>(args?: SelectSubset<T, LeagueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leagues and returns the data saved in the database.
     * @param {LeagueCreateManyAndReturnArgs} args - Arguments to create many Leagues.
     * @example
     * // Create many Leagues
     * const league = await prisma.league.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leagues and only return the `id`
     * const leagueWithIdOnly = await prisma.league.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeagueCreateManyAndReturnArgs>(args?: SelectSubset<T, LeagueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a League.
     * @param {LeagueDeleteArgs} args - Arguments to delete one League.
     * @example
     * // Delete one League
     * const League = await prisma.league.delete({
     *   where: {
     *     // ... filter to delete one League
     *   }
     * })
     * 
     */
    delete<T extends LeagueDeleteArgs>(args: SelectSubset<T, LeagueDeleteArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one League.
     * @param {LeagueUpdateArgs} args - Arguments to update one League.
     * @example
     * // Update one League
     * const league = await prisma.league.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeagueUpdateArgs>(args: SelectSubset<T, LeagueUpdateArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leagues.
     * @param {LeagueDeleteManyArgs} args - Arguments to filter Leagues to delete.
     * @example
     * // Delete a few Leagues
     * const { count } = await prisma.league.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeagueDeleteManyArgs>(args?: SelectSubset<T, LeagueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leagues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leagues
     * const league = await prisma.league.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeagueUpdateManyArgs>(args: SelectSubset<T, LeagueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leagues and returns the data updated in the database.
     * @param {LeagueUpdateManyAndReturnArgs} args - Arguments to update many Leagues.
     * @example
     * // Update many Leagues
     * const league = await prisma.league.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leagues and only return the `id`
     * const leagueWithIdOnly = await prisma.league.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeagueUpdateManyAndReturnArgs>(args: SelectSubset<T, LeagueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one League.
     * @param {LeagueUpsertArgs} args - Arguments to update or create a League.
     * @example
     * // Update or create a League
     * const league = await prisma.league.upsert({
     *   create: {
     *     // ... data to create a League
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the League we want to update
     *   }
     * })
     */
    upsert<T extends LeagueUpsertArgs>(args: SelectSubset<T, LeagueUpsertArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leagues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueCountArgs} args - Arguments to filter Leagues to count.
     * @example
     * // Count the number of Leagues
     * const count = await prisma.league.count({
     *   where: {
     *     // ... the filter for the Leagues we want to count
     *   }
     * })
    **/
    count<T extends LeagueCountArgs>(
      args?: Subset<T, LeagueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeagueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a League.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeagueAggregateArgs>(args: Subset<T, LeagueAggregateArgs>): Prisma.PrismaPromise<GetLeagueAggregateType<T>>

    /**
     * Group by League.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeagueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeagueGroupByArgs['orderBy'] }
        : { orderBy?: LeagueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeagueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeagueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the League model
   */
  readonly fields: LeagueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for League.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeagueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    memberships<T extends League$membershipsArgs<ExtArgs> = {}>(args?: Subset<T, League$membershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratings<T extends League$ratingsArgs<ExtArgs> = {}>(args?: Subset<T, League$ratingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    challenges<T extends League$challengesArgs<ExtArgs> = {}>(args?: Subset<T, League$challengesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    matches<T extends League$matchesArgs<ExtArgs> = {}>(args?: Subset<T, League$matchesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratingUpdates<T extends League$ratingUpdatesArgs<ExtArgs> = {}>(args?: Subset<T, League$ratingUpdatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the League model
   */
  interface LeagueFieldRefs {
    readonly id: FieldRef<"League", 'String'>
    readonly name: FieldRef<"League", 'String'>
    readonly gameType: FieldRef<"League", 'String'>
    readonly createdAt: FieldRef<"League", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * League findUnique
   */
  export type LeagueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter, which League to fetch.
     */
    where: LeagueWhereUniqueInput
  }

  /**
   * League findUniqueOrThrow
   */
  export type LeagueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter, which League to fetch.
     */
    where: LeagueWhereUniqueInput
  }

  /**
   * League findFirst
   */
  export type LeagueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter, which League to fetch.
     */
    where?: LeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leagues to fetch.
     */
    orderBy?: LeagueOrderByWithRelationInput | LeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leagues.
     */
    cursor?: LeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leagues.
     */
    distinct?: LeagueScalarFieldEnum | LeagueScalarFieldEnum[]
  }

  /**
   * League findFirstOrThrow
   */
  export type LeagueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter, which League to fetch.
     */
    where?: LeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leagues to fetch.
     */
    orderBy?: LeagueOrderByWithRelationInput | LeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leagues.
     */
    cursor?: LeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leagues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leagues.
     */
    distinct?: LeagueScalarFieldEnum | LeagueScalarFieldEnum[]
  }

  /**
   * League findMany
   */
  export type LeagueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter, which Leagues to fetch.
     */
    where?: LeagueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leagues to fetch.
     */
    orderBy?: LeagueOrderByWithRelationInput | LeagueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leagues.
     */
    cursor?: LeagueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leagues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leagues.
     */
    skip?: number
    distinct?: LeagueScalarFieldEnum | LeagueScalarFieldEnum[]
  }

  /**
   * League create
   */
  export type LeagueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * The data needed to create a League.
     */
    data: XOR<LeagueCreateInput, LeagueUncheckedCreateInput>
  }

  /**
   * League createMany
   */
  export type LeagueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leagues.
     */
    data: LeagueCreateManyInput | LeagueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * League createManyAndReturn
   */
  export type LeagueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * The data used to create many Leagues.
     */
    data: LeagueCreateManyInput | LeagueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * League update
   */
  export type LeagueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * The data needed to update a League.
     */
    data: XOR<LeagueUpdateInput, LeagueUncheckedUpdateInput>
    /**
     * Choose, which League to update.
     */
    where: LeagueWhereUniqueInput
  }

  /**
   * League updateMany
   */
  export type LeagueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leagues.
     */
    data: XOR<LeagueUpdateManyMutationInput, LeagueUncheckedUpdateManyInput>
    /**
     * Filter which Leagues to update
     */
    where?: LeagueWhereInput
    /**
     * Limit how many Leagues to update.
     */
    limit?: number
  }

  /**
   * League updateManyAndReturn
   */
  export type LeagueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * The data used to update Leagues.
     */
    data: XOR<LeagueUpdateManyMutationInput, LeagueUncheckedUpdateManyInput>
    /**
     * Filter which Leagues to update
     */
    where?: LeagueWhereInput
    /**
     * Limit how many Leagues to update.
     */
    limit?: number
  }

  /**
   * League upsert
   */
  export type LeagueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * The filter to search for the League to update in case it exists.
     */
    where: LeagueWhereUniqueInput
    /**
     * In case the League found by the `where` argument doesn't exist, create a new League with this data.
     */
    create: XOR<LeagueCreateInput, LeagueUncheckedCreateInput>
    /**
     * In case the League was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeagueUpdateInput, LeagueUncheckedUpdateInput>
  }

  /**
   * League delete
   */
  export type LeagueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
    /**
     * Filter which League to delete.
     */
    where: LeagueWhereUniqueInput
  }

  /**
   * League deleteMany
   */
  export type LeagueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leagues to delete
     */
    where?: LeagueWhereInput
    /**
     * Limit how many Leagues to delete.
     */
    limit?: number
  }

  /**
   * League.memberships
   */
  export type League$membershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    where?: LeagueMembershipWhereInput
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    cursor?: LeagueMembershipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeagueMembershipScalarFieldEnum | LeagueMembershipScalarFieldEnum[]
  }

  /**
   * League.ratings
   */
  export type League$ratingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    where?: PlayerRatingWhereInput
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    cursor?: PlayerRatingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PlayerRatingScalarFieldEnum | PlayerRatingScalarFieldEnum[]
  }

  /**
   * League.challenges
   */
  export type League$challengesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    where?: ChallengeWhereInput
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    cursor?: ChallengeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * League.matches
   */
  export type League$matchesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * League.ratingUpdates
   */
  export type League$ratingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    where?: RatingUpdateWhereInput
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    cursor?: RatingUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * League without action
   */
  export type LeagueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the League
     */
    select?: LeagueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the League
     */
    omit?: LeagueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueInclude<ExtArgs> | null
  }


  /**
   * Model LeagueMembership
   */

  export type AggregateLeagueMembership = {
    _count: LeagueMembershipCountAggregateOutputType | null
    _min: LeagueMembershipMinAggregateOutputType | null
    _max: LeagueMembershipMaxAggregateOutputType | null
  }

  export type LeagueMembershipMinAggregateOutputType = {
    id: string | null
    playerId: string | null
    leagueId: string | null
    joinedAt: Date | null
    isActive: boolean | null
  }

  export type LeagueMembershipMaxAggregateOutputType = {
    id: string | null
    playerId: string | null
    leagueId: string | null
    joinedAt: Date | null
    isActive: boolean | null
  }

  export type LeagueMembershipCountAggregateOutputType = {
    id: number
    playerId: number
    leagueId: number
    joinedAt: number
    isActive: number
    _all: number
  }


  export type LeagueMembershipMinAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    joinedAt?: true
    isActive?: true
  }

  export type LeagueMembershipMaxAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    joinedAt?: true
    isActive?: true
  }

  export type LeagueMembershipCountAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    joinedAt?: true
    isActive?: true
    _all?: true
  }

  export type LeagueMembershipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeagueMembership to aggregate.
     */
    where?: LeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeagueMemberships to fetch.
     */
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeagueMemberships
    **/
    _count?: true | LeagueMembershipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeagueMembershipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeagueMembershipMaxAggregateInputType
  }

  export type GetLeagueMembershipAggregateType<T extends LeagueMembershipAggregateArgs> = {
        [P in keyof T & keyof AggregateLeagueMembership]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeagueMembership[P]>
      : GetScalarType<T[P], AggregateLeagueMembership[P]>
  }




  export type LeagueMembershipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeagueMembershipWhereInput
    orderBy?: LeagueMembershipOrderByWithAggregationInput | LeagueMembershipOrderByWithAggregationInput[]
    by: LeagueMembershipScalarFieldEnum[] | LeagueMembershipScalarFieldEnum
    having?: LeagueMembershipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeagueMembershipCountAggregateInputType | true
    _min?: LeagueMembershipMinAggregateInputType
    _max?: LeagueMembershipMaxAggregateInputType
  }

  export type LeagueMembershipGroupByOutputType = {
    id: string
    playerId: string
    leagueId: string
    joinedAt: Date
    isActive: boolean
    _count: LeagueMembershipCountAggregateOutputType | null
    _min: LeagueMembershipMinAggregateOutputType | null
    _max: LeagueMembershipMaxAggregateOutputType | null
  }

  type GetLeagueMembershipGroupByPayload<T extends LeagueMembershipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeagueMembershipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeagueMembershipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeagueMembershipGroupByOutputType[P]>
            : GetScalarType<T[P], LeagueMembershipGroupByOutputType[P]>
        }
      >
    >


  export type LeagueMembershipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    joinedAt?: boolean
    isActive?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leagueMembership"]>

  export type LeagueMembershipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    joinedAt?: boolean
    isActive?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leagueMembership"]>

  export type LeagueMembershipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    joinedAt?: boolean
    isActive?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leagueMembership"]>

  export type LeagueMembershipSelectScalar = {
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    joinedAt?: boolean
    isActive?: boolean
  }

  export type LeagueMembershipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "playerId" | "leagueId" | "joinedAt" | "isActive", ExtArgs["result"]["leagueMembership"]>
  export type LeagueMembershipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type LeagueMembershipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type LeagueMembershipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }

  export type $LeagueMembershipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeagueMembership"
    objects: {
      player: Prisma.$PlayerPayload<ExtArgs>
      league: Prisma.$LeaguePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      playerId: string
      leagueId: string
      joinedAt: Date
      isActive: boolean
    }, ExtArgs["result"]["leagueMembership"]>
    composites: {}
  }

  type LeagueMembershipGetPayload<S extends boolean | null | undefined | LeagueMembershipDefaultArgs> = $Result.GetResult<Prisma.$LeagueMembershipPayload, S>

  type LeagueMembershipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeagueMembershipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeagueMembershipCountAggregateInputType | true
    }

  export interface LeagueMembershipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeagueMembership'], meta: { name: 'LeagueMembership' } }
    /**
     * Find zero or one LeagueMembership that matches the filter.
     * @param {LeagueMembershipFindUniqueArgs} args - Arguments to find a LeagueMembership
     * @example
     * // Get one LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeagueMembershipFindUniqueArgs>(args: SelectSubset<T, LeagueMembershipFindUniqueArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LeagueMembership that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeagueMembershipFindUniqueOrThrowArgs} args - Arguments to find a LeagueMembership
     * @example
     * // Get one LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeagueMembershipFindUniqueOrThrowArgs>(args: SelectSubset<T, LeagueMembershipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeagueMembership that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipFindFirstArgs} args - Arguments to find a LeagueMembership
     * @example
     * // Get one LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeagueMembershipFindFirstArgs>(args?: SelectSubset<T, LeagueMembershipFindFirstArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeagueMembership that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipFindFirstOrThrowArgs} args - Arguments to find a LeagueMembership
     * @example
     * // Get one LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeagueMembershipFindFirstOrThrowArgs>(args?: SelectSubset<T, LeagueMembershipFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LeagueMemberships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeagueMemberships
     * const leagueMemberships = await prisma.leagueMembership.findMany()
     * 
     * // Get first 10 LeagueMemberships
     * const leagueMemberships = await prisma.leagueMembership.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leagueMembershipWithIdOnly = await prisma.leagueMembership.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeagueMembershipFindManyArgs>(args?: SelectSubset<T, LeagueMembershipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LeagueMembership.
     * @param {LeagueMembershipCreateArgs} args - Arguments to create a LeagueMembership.
     * @example
     * // Create one LeagueMembership
     * const LeagueMembership = await prisma.leagueMembership.create({
     *   data: {
     *     // ... data to create a LeagueMembership
     *   }
     * })
     * 
     */
    create<T extends LeagueMembershipCreateArgs>(args: SelectSubset<T, LeagueMembershipCreateArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LeagueMemberships.
     * @param {LeagueMembershipCreateManyArgs} args - Arguments to create many LeagueMemberships.
     * @example
     * // Create many LeagueMemberships
     * const leagueMembership = await prisma.leagueMembership.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeagueMembershipCreateManyArgs>(args?: SelectSubset<T, LeagueMembershipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeagueMemberships and returns the data saved in the database.
     * @param {LeagueMembershipCreateManyAndReturnArgs} args - Arguments to create many LeagueMemberships.
     * @example
     * // Create many LeagueMemberships
     * const leagueMembership = await prisma.leagueMembership.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeagueMemberships and only return the `id`
     * const leagueMembershipWithIdOnly = await prisma.leagueMembership.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeagueMembershipCreateManyAndReturnArgs>(args?: SelectSubset<T, LeagueMembershipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LeagueMembership.
     * @param {LeagueMembershipDeleteArgs} args - Arguments to delete one LeagueMembership.
     * @example
     * // Delete one LeagueMembership
     * const LeagueMembership = await prisma.leagueMembership.delete({
     *   where: {
     *     // ... filter to delete one LeagueMembership
     *   }
     * })
     * 
     */
    delete<T extends LeagueMembershipDeleteArgs>(args: SelectSubset<T, LeagueMembershipDeleteArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LeagueMembership.
     * @param {LeagueMembershipUpdateArgs} args - Arguments to update one LeagueMembership.
     * @example
     * // Update one LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeagueMembershipUpdateArgs>(args: SelectSubset<T, LeagueMembershipUpdateArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LeagueMemberships.
     * @param {LeagueMembershipDeleteManyArgs} args - Arguments to filter LeagueMemberships to delete.
     * @example
     * // Delete a few LeagueMemberships
     * const { count } = await prisma.leagueMembership.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeagueMembershipDeleteManyArgs>(args?: SelectSubset<T, LeagueMembershipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeagueMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeagueMemberships
     * const leagueMembership = await prisma.leagueMembership.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeagueMembershipUpdateManyArgs>(args: SelectSubset<T, LeagueMembershipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeagueMemberships and returns the data updated in the database.
     * @param {LeagueMembershipUpdateManyAndReturnArgs} args - Arguments to update many LeagueMemberships.
     * @example
     * // Update many LeagueMemberships
     * const leagueMembership = await prisma.leagueMembership.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LeagueMemberships and only return the `id`
     * const leagueMembershipWithIdOnly = await prisma.leagueMembership.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeagueMembershipUpdateManyAndReturnArgs>(args: SelectSubset<T, LeagueMembershipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LeagueMembership.
     * @param {LeagueMembershipUpsertArgs} args - Arguments to update or create a LeagueMembership.
     * @example
     * // Update or create a LeagueMembership
     * const leagueMembership = await prisma.leagueMembership.upsert({
     *   create: {
     *     // ... data to create a LeagueMembership
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeagueMembership we want to update
     *   }
     * })
     */
    upsert<T extends LeagueMembershipUpsertArgs>(args: SelectSubset<T, LeagueMembershipUpsertArgs<ExtArgs>>): Prisma__LeagueMembershipClient<$Result.GetResult<Prisma.$LeagueMembershipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LeagueMemberships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipCountArgs} args - Arguments to filter LeagueMemberships to count.
     * @example
     * // Count the number of LeagueMemberships
     * const count = await prisma.leagueMembership.count({
     *   where: {
     *     // ... the filter for the LeagueMemberships we want to count
     *   }
     * })
    **/
    count<T extends LeagueMembershipCountArgs>(
      args?: Subset<T, LeagueMembershipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeagueMembershipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeagueMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeagueMembershipAggregateArgs>(args: Subset<T, LeagueMembershipAggregateArgs>): Prisma.PrismaPromise<GetLeagueMembershipAggregateType<T>>

    /**
     * Group by LeagueMembership.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeagueMembershipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeagueMembershipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeagueMembershipGroupByArgs['orderBy'] }
        : { orderBy?: LeagueMembershipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeagueMembershipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeagueMembershipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeagueMembership model
   */
  readonly fields: LeagueMembershipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeagueMembership.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeagueMembershipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    league<T extends LeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeagueDefaultArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeagueMembership model
   */
  interface LeagueMembershipFieldRefs {
    readonly id: FieldRef<"LeagueMembership", 'String'>
    readonly playerId: FieldRef<"LeagueMembership", 'String'>
    readonly leagueId: FieldRef<"LeagueMembership", 'String'>
    readonly joinedAt: FieldRef<"LeagueMembership", 'DateTime'>
    readonly isActive: FieldRef<"LeagueMembership", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * LeagueMembership findUnique
   */
  export type LeagueMembershipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which LeagueMembership to fetch.
     */
    where: LeagueMembershipWhereUniqueInput
  }

  /**
   * LeagueMembership findUniqueOrThrow
   */
  export type LeagueMembershipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which LeagueMembership to fetch.
     */
    where: LeagueMembershipWhereUniqueInput
  }

  /**
   * LeagueMembership findFirst
   */
  export type LeagueMembershipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which LeagueMembership to fetch.
     */
    where?: LeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeagueMemberships to fetch.
     */
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeagueMemberships.
     */
    cursor?: LeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeagueMemberships.
     */
    distinct?: LeagueMembershipScalarFieldEnum | LeagueMembershipScalarFieldEnum[]
  }

  /**
   * LeagueMembership findFirstOrThrow
   */
  export type LeagueMembershipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which LeagueMembership to fetch.
     */
    where?: LeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeagueMemberships to fetch.
     */
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeagueMemberships.
     */
    cursor?: LeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeagueMemberships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeagueMemberships.
     */
    distinct?: LeagueMembershipScalarFieldEnum | LeagueMembershipScalarFieldEnum[]
  }

  /**
   * LeagueMembership findMany
   */
  export type LeagueMembershipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter, which LeagueMemberships to fetch.
     */
    where?: LeagueMembershipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeagueMemberships to fetch.
     */
    orderBy?: LeagueMembershipOrderByWithRelationInput | LeagueMembershipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeagueMemberships.
     */
    cursor?: LeagueMembershipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeagueMemberships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeagueMemberships.
     */
    skip?: number
    distinct?: LeagueMembershipScalarFieldEnum | LeagueMembershipScalarFieldEnum[]
  }

  /**
   * LeagueMembership create
   */
  export type LeagueMembershipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * The data needed to create a LeagueMembership.
     */
    data: XOR<LeagueMembershipCreateInput, LeagueMembershipUncheckedCreateInput>
  }

  /**
   * LeagueMembership createMany
   */
  export type LeagueMembershipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeagueMemberships.
     */
    data: LeagueMembershipCreateManyInput | LeagueMembershipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeagueMembership createManyAndReturn
   */
  export type LeagueMembershipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * The data used to create many LeagueMemberships.
     */
    data: LeagueMembershipCreateManyInput | LeagueMembershipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeagueMembership update
   */
  export type LeagueMembershipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * The data needed to update a LeagueMembership.
     */
    data: XOR<LeagueMembershipUpdateInput, LeagueMembershipUncheckedUpdateInput>
    /**
     * Choose, which LeagueMembership to update.
     */
    where: LeagueMembershipWhereUniqueInput
  }

  /**
   * LeagueMembership updateMany
   */
  export type LeagueMembershipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeagueMemberships.
     */
    data: XOR<LeagueMembershipUpdateManyMutationInput, LeagueMembershipUncheckedUpdateManyInput>
    /**
     * Filter which LeagueMemberships to update
     */
    where?: LeagueMembershipWhereInput
    /**
     * Limit how many LeagueMemberships to update.
     */
    limit?: number
  }

  /**
   * LeagueMembership updateManyAndReturn
   */
  export type LeagueMembershipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * The data used to update LeagueMemberships.
     */
    data: XOR<LeagueMembershipUpdateManyMutationInput, LeagueMembershipUncheckedUpdateManyInput>
    /**
     * Filter which LeagueMemberships to update
     */
    where?: LeagueMembershipWhereInput
    /**
     * Limit how many LeagueMemberships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeagueMembership upsert
   */
  export type LeagueMembershipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * The filter to search for the LeagueMembership to update in case it exists.
     */
    where: LeagueMembershipWhereUniqueInput
    /**
     * In case the LeagueMembership found by the `where` argument doesn't exist, create a new LeagueMembership with this data.
     */
    create: XOR<LeagueMembershipCreateInput, LeagueMembershipUncheckedCreateInput>
    /**
     * In case the LeagueMembership was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeagueMembershipUpdateInput, LeagueMembershipUncheckedUpdateInput>
  }

  /**
   * LeagueMembership delete
   */
  export type LeagueMembershipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
    /**
     * Filter which LeagueMembership to delete.
     */
    where: LeagueMembershipWhereUniqueInput
  }

  /**
   * LeagueMembership deleteMany
   */
  export type LeagueMembershipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeagueMemberships to delete
     */
    where?: LeagueMembershipWhereInput
    /**
     * Limit how many LeagueMemberships to delete.
     */
    limit?: number
  }

  /**
   * LeagueMembership without action
   */
  export type LeagueMembershipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeagueMembership
     */
    select?: LeagueMembershipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeagueMembership
     */
    omit?: LeagueMembershipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeagueMembershipInclude<ExtArgs> | null
  }


  /**
   * Model PlayerRating
   */

  export type AggregatePlayerRating = {
    _count: PlayerRatingCountAggregateOutputType | null
    _avg: PlayerRatingAvgAggregateOutputType | null
    _sum: PlayerRatingSumAggregateOutputType | null
    _min: PlayerRatingMinAggregateOutputType | null
    _max: PlayerRatingMaxAggregateOutputType | null
  }

  export type PlayerRatingAvgAggregateOutputType = {
    rating: number | null
    gamesPlayed: number | null
    wins: number | null
    losses: number | null
    draws: number | null
  }

  export type PlayerRatingSumAggregateOutputType = {
    rating: number | null
    gamesPlayed: number | null
    wins: number | null
    losses: number | null
    draws: number | null
  }

  export type PlayerRatingMinAggregateOutputType = {
    id: string | null
    playerId: string | null
    leagueId: string | null
    rating: number | null
    gamesPlayed: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    updatedAt: Date | null
  }

  export type PlayerRatingMaxAggregateOutputType = {
    id: string | null
    playerId: string | null
    leagueId: string | null
    rating: number | null
    gamesPlayed: number | null
    wins: number | null
    losses: number | null
    draws: number | null
    updatedAt: Date | null
  }

  export type PlayerRatingCountAggregateOutputType = {
    id: number
    playerId: number
    leagueId: number
    rating: number
    gamesPlayed: number
    wins: number
    losses: number
    draws: number
    updatedAt: number
    _all: number
  }


  export type PlayerRatingAvgAggregateInputType = {
    rating?: true
    gamesPlayed?: true
    wins?: true
    losses?: true
    draws?: true
  }

  export type PlayerRatingSumAggregateInputType = {
    rating?: true
    gamesPlayed?: true
    wins?: true
    losses?: true
    draws?: true
  }

  export type PlayerRatingMinAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    rating?: true
    gamesPlayed?: true
    wins?: true
    losses?: true
    draws?: true
    updatedAt?: true
  }

  export type PlayerRatingMaxAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    rating?: true
    gamesPlayed?: true
    wins?: true
    losses?: true
    draws?: true
    updatedAt?: true
  }

  export type PlayerRatingCountAggregateInputType = {
    id?: true
    playerId?: true
    leagueId?: true
    rating?: true
    gamesPlayed?: true
    wins?: true
    losses?: true
    draws?: true
    updatedAt?: true
    _all?: true
  }

  export type PlayerRatingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerRating to aggregate.
     */
    where?: PlayerRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRatings to fetch.
     */
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PlayerRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlayerRatings
    **/
    _count?: true | PlayerRatingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PlayerRatingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PlayerRatingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlayerRatingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlayerRatingMaxAggregateInputType
  }

  export type GetPlayerRatingAggregateType<T extends PlayerRatingAggregateArgs> = {
        [P in keyof T & keyof AggregatePlayerRating]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlayerRating[P]>
      : GetScalarType<T[P], AggregatePlayerRating[P]>
  }




  export type PlayerRatingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PlayerRatingWhereInput
    orderBy?: PlayerRatingOrderByWithAggregationInput | PlayerRatingOrderByWithAggregationInput[]
    by: PlayerRatingScalarFieldEnum[] | PlayerRatingScalarFieldEnum
    having?: PlayerRatingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlayerRatingCountAggregateInputType | true
    _avg?: PlayerRatingAvgAggregateInputType
    _sum?: PlayerRatingSumAggregateInputType
    _min?: PlayerRatingMinAggregateInputType
    _max?: PlayerRatingMaxAggregateInputType
  }

  export type PlayerRatingGroupByOutputType = {
    id: string
    playerId: string
    leagueId: string
    rating: number
    gamesPlayed: number
    wins: number
    losses: number
    draws: number
    updatedAt: Date
    _count: PlayerRatingCountAggregateOutputType | null
    _avg: PlayerRatingAvgAggregateOutputType | null
    _sum: PlayerRatingSumAggregateOutputType | null
    _min: PlayerRatingMinAggregateOutputType | null
    _max: PlayerRatingMaxAggregateOutputType | null
  }

  type GetPlayerRatingGroupByPayload<T extends PlayerRatingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PlayerRatingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlayerRatingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlayerRatingGroupByOutputType[P]>
            : GetScalarType<T[P], PlayerRatingGroupByOutputType[P]>
        }
      >
    >


  export type PlayerRatingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    rating?: boolean
    gamesPlayed?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    updatedAt?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRating"]>

  export type PlayerRatingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    rating?: boolean
    gamesPlayed?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    updatedAt?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRating"]>

  export type PlayerRatingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    rating?: boolean
    gamesPlayed?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    updatedAt?: boolean
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["playerRating"]>

  export type PlayerRatingSelectScalar = {
    id?: boolean
    playerId?: boolean
    leagueId?: boolean
    rating?: boolean
    gamesPlayed?: boolean
    wins?: boolean
    losses?: boolean
    draws?: boolean
    updatedAt?: boolean
  }

  export type PlayerRatingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "playerId" | "leagueId" | "rating" | "gamesPlayed" | "wins" | "losses" | "draws" | "updatedAt", ExtArgs["result"]["playerRating"]>
  export type PlayerRatingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type PlayerRatingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type PlayerRatingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }

  export type $PlayerRatingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PlayerRating"
    objects: {
      player: Prisma.$PlayerPayload<ExtArgs>
      league: Prisma.$LeaguePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      playerId: string
      leagueId: string
      rating: number
      gamesPlayed: number
      wins: number
      losses: number
      draws: number
      updatedAt: Date
    }, ExtArgs["result"]["playerRating"]>
    composites: {}
  }

  type PlayerRatingGetPayload<S extends boolean | null | undefined | PlayerRatingDefaultArgs> = $Result.GetResult<Prisma.$PlayerRatingPayload, S>

  type PlayerRatingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PlayerRatingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PlayerRatingCountAggregateInputType | true
    }

  export interface PlayerRatingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PlayerRating'], meta: { name: 'PlayerRating' } }
    /**
     * Find zero or one PlayerRating that matches the filter.
     * @param {PlayerRatingFindUniqueArgs} args - Arguments to find a PlayerRating
     * @example
     * // Get one PlayerRating
     * const playerRating = await prisma.playerRating.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PlayerRatingFindUniqueArgs>(args: SelectSubset<T, PlayerRatingFindUniqueArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PlayerRating that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PlayerRatingFindUniqueOrThrowArgs} args - Arguments to find a PlayerRating
     * @example
     * // Get one PlayerRating
     * const playerRating = await prisma.playerRating.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PlayerRatingFindUniqueOrThrowArgs>(args: SelectSubset<T, PlayerRatingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerRating that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingFindFirstArgs} args - Arguments to find a PlayerRating
     * @example
     * // Get one PlayerRating
     * const playerRating = await prisma.playerRating.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PlayerRatingFindFirstArgs>(args?: SelectSubset<T, PlayerRatingFindFirstArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PlayerRating that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingFindFirstOrThrowArgs} args - Arguments to find a PlayerRating
     * @example
     * // Get one PlayerRating
     * const playerRating = await prisma.playerRating.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PlayerRatingFindFirstOrThrowArgs>(args?: SelectSubset<T, PlayerRatingFindFirstOrThrowArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PlayerRatings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlayerRatings
     * const playerRatings = await prisma.playerRating.findMany()
     * 
     * // Get first 10 PlayerRatings
     * const playerRatings = await prisma.playerRating.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const playerRatingWithIdOnly = await prisma.playerRating.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PlayerRatingFindManyArgs>(args?: SelectSubset<T, PlayerRatingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PlayerRating.
     * @param {PlayerRatingCreateArgs} args - Arguments to create a PlayerRating.
     * @example
     * // Create one PlayerRating
     * const PlayerRating = await prisma.playerRating.create({
     *   data: {
     *     // ... data to create a PlayerRating
     *   }
     * })
     * 
     */
    create<T extends PlayerRatingCreateArgs>(args: SelectSubset<T, PlayerRatingCreateArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PlayerRatings.
     * @param {PlayerRatingCreateManyArgs} args - Arguments to create many PlayerRatings.
     * @example
     * // Create many PlayerRatings
     * const playerRating = await prisma.playerRating.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PlayerRatingCreateManyArgs>(args?: SelectSubset<T, PlayerRatingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PlayerRatings and returns the data saved in the database.
     * @param {PlayerRatingCreateManyAndReturnArgs} args - Arguments to create many PlayerRatings.
     * @example
     * // Create many PlayerRatings
     * const playerRating = await prisma.playerRating.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PlayerRatings and only return the `id`
     * const playerRatingWithIdOnly = await prisma.playerRating.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PlayerRatingCreateManyAndReturnArgs>(args?: SelectSubset<T, PlayerRatingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PlayerRating.
     * @param {PlayerRatingDeleteArgs} args - Arguments to delete one PlayerRating.
     * @example
     * // Delete one PlayerRating
     * const PlayerRating = await prisma.playerRating.delete({
     *   where: {
     *     // ... filter to delete one PlayerRating
     *   }
     * })
     * 
     */
    delete<T extends PlayerRatingDeleteArgs>(args: SelectSubset<T, PlayerRatingDeleteArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PlayerRating.
     * @param {PlayerRatingUpdateArgs} args - Arguments to update one PlayerRating.
     * @example
     * // Update one PlayerRating
     * const playerRating = await prisma.playerRating.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PlayerRatingUpdateArgs>(args: SelectSubset<T, PlayerRatingUpdateArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PlayerRatings.
     * @param {PlayerRatingDeleteManyArgs} args - Arguments to filter PlayerRatings to delete.
     * @example
     * // Delete a few PlayerRatings
     * const { count } = await prisma.playerRating.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PlayerRatingDeleteManyArgs>(args?: SelectSubset<T, PlayerRatingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlayerRatings
     * const playerRating = await prisma.playerRating.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PlayerRatingUpdateManyArgs>(args: SelectSubset<T, PlayerRatingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlayerRatings and returns the data updated in the database.
     * @param {PlayerRatingUpdateManyAndReturnArgs} args - Arguments to update many PlayerRatings.
     * @example
     * // Update many PlayerRatings
     * const playerRating = await prisma.playerRating.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PlayerRatings and only return the `id`
     * const playerRatingWithIdOnly = await prisma.playerRating.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PlayerRatingUpdateManyAndReturnArgs>(args: SelectSubset<T, PlayerRatingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PlayerRating.
     * @param {PlayerRatingUpsertArgs} args - Arguments to update or create a PlayerRating.
     * @example
     * // Update or create a PlayerRating
     * const playerRating = await prisma.playerRating.upsert({
     *   create: {
     *     // ... data to create a PlayerRating
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlayerRating we want to update
     *   }
     * })
     */
    upsert<T extends PlayerRatingUpsertArgs>(args: SelectSubset<T, PlayerRatingUpsertArgs<ExtArgs>>): Prisma__PlayerRatingClient<$Result.GetResult<Prisma.$PlayerRatingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PlayerRatings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingCountArgs} args - Arguments to filter PlayerRatings to count.
     * @example
     * // Count the number of PlayerRatings
     * const count = await prisma.playerRating.count({
     *   where: {
     *     // ... the filter for the PlayerRatings we want to count
     *   }
     * })
    **/
    count<T extends PlayerRatingCountArgs>(
      args?: Subset<T, PlayerRatingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlayerRatingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlayerRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlayerRatingAggregateArgs>(args: Subset<T, PlayerRatingAggregateArgs>): Prisma.PrismaPromise<GetPlayerRatingAggregateType<T>>

    /**
     * Group by PlayerRating.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlayerRatingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlayerRatingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlayerRatingGroupByArgs['orderBy'] }
        : { orderBy?: PlayerRatingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlayerRatingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlayerRatingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PlayerRating model
   */
  readonly fields: PlayerRatingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PlayerRating.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PlayerRatingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    league<T extends LeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeagueDefaultArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PlayerRating model
   */
  interface PlayerRatingFieldRefs {
    readonly id: FieldRef<"PlayerRating", 'String'>
    readonly playerId: FieldRef<"PlayerRating", 'String'>
    readonly leagueId: FieldRef<"PlayerRating", 'String'>
    readonly rating: FieldRef<"PlayerRating", 'Int'>
    readonly gamesPlayed: FieldRef<"PlayerRating", 'Int'>
    readonly wins: FieldRef<"PlayerRating", 'Int'>
    readonly losses: FieldRef<"PlayerRating", 'Int'>
    readonly draws: FieldRef<"PlayerRating", 'Int'>
    readonly updatedAt: FieldRef<"PlayerRating", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PlayerRating findUnique
   */
  export type PlayerRatingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRating to fetch.
     */
    where: PlayerRatingWhereUniqueInput
  }

  /**
   * PlayerRating findUniqueOrThrow
   */
  export type PlayerRatingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRating to fetch.
     */
    where: PlayerRatingWhereUniqueInput
  }

  /**
   * PlayerRating findFirst
   */
  export type PlayerRatingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRating to fetch.
     */
    where?: PlayerRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRatings to fetch.
     */
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerRatings.
     */
    cursor?: PlayerRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerRatings.
     */
    distinct?: PlayerRatingScalarFieldEnum | PlayerRatingScalarFieldEnum[]
  }

  /**
   * PlayerRating findFirstOrThrow
   */
  export type PlayerRatingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRating to fetch.
     */
    where?: PlayerRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRatings to fetch.
     */
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlayerRatings.
     */
    cursor?: PlayerRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRatings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlayerRatings.
     */
    distinct?: PlayerRatingScalarFieldEnum | PlayerRatingScalarFieldEnum[]
  }

  /**
   * PlayerRating findMany
   */
  export type PlayerRatingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter, which PlayerRatings to fetch.
     */
    where?: PlayerRatingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlayerRatings to fetch.
     */
    orderBy?: PlayerRatingOrderByWithRelationInput | PlayerRatingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlayerRatings.
     */
    cursor?: PlayerRatingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlayerRatings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlayerRatings.
     */
    skip?: number
    distinct?: PlayerRatingScalarFieldEnum | PlayerRatingScalarFieldEnum[]
  }

  /**
   * PlayerRating create
   */
  export type PlayerRatingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * The data needed to create a PlayerRating.
     */
    data: XOR<PlayerRatingCreateInput, PlayerRatingUncheckedCreateInput>
  }

  /**
   * PlayerRating createMany
   */
  export type PlayerRatingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PlayerRatings.
     */
    data: PlayerRatingCreateManyInput | PlayerRatingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PlayerRating createManyAndReturn
   */
  export type PlayerRatingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * The data used to create many PlayerRatings.
     */
    data: PlayerRatingCreateManyInput | PlayerRatingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerRating update
   */
  export type PlayerRatingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * The data needed to update a PlayerRating.
     */
    data: XOR<PlayerRatingUpdateInput, PlayerRatingUncheckedUpdateInput>
    /**
     * Choose, which PlayerRating to update.
     */
    where: PlayerRatingWhereUniqueInput
  }

  /**
   * PlayerRating updateMany
   */
  export type PlayerRatingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PlayerRatings.
     */
    data: XOR<PlayerRatingUpdateManyMutationInput, PlayerRatingUncheckedUpdateManyInput>
    /**
     * Filter which PlayerRatings to update
     */
    where?: PlayerRatingWhereInput
    /**
     * Limit how many PlayerRatings to update.
     */
    limit?: number
  }

  /**
   * PlayerRating updateManyAndReturn
   */
  export type PlayerRatingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * The data used to update PlayerRatings.
     */
    data: XOR<PlayerRatingUpdateManyMutationInput, PlayerRatingUncheckedUpdateManyInput>
    /**
     * Filter which PlayerRatings to update
     */
    where?: PlayerRatingWhereInput
    /**
     * Limit how many PlayerRatings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PlayerRating upsert
   */
  export type PlayerRatingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * The filter to search for the PlayerRating to update in case it exists.
     */
    where: PlayerRatingWhereUniqueInput
    /**
     * In case the PlayerRating found by the `where` argument doesn't exist, create a new PlayerRating with this data.
     */
    create: XOR<PlayerRatingCreateInput, PlayerRatingUncheckedCreateInput>
    /**
     * In case the PlayerRating was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PlayerRatingUpdateInput, PlayerRatingUncheckedUpdateInput>
  }

  /**
   * PlayerRating delete
   */
  export type PlayerRatingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
    /**
     * Filter which PlayerRating to delete.
     */
    where: PlayerRatingWhereUniqueInput
  }

  /**
   * PlayerRating deleteMany
   */
  export type PlayerRatingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PlayerRatings to delete
     */
    where?: PlayerRatingWhereInput
    /**
     * Limit how many PlayerRatings to delete.
     */
    limit?: number
  }

  /**
   * PlayerRating without action
   */
  export type PlayerRatingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PlayerRating
     */
    select?: PlayerRatingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PlayerRating
     */
    omit?: PlayerRatingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerRatingInclude<ExtArgs> | null
  }


  /**
   * Model Challenge
   */

  export type AggregateChallenge = {
    _count: ChallengeCountAggregateOutputType | null
    _min: ChallengeMinAggregateOutputType | null
    _max: ChallengeMaxAggregateOutputType | null
  }

  export type ChallengeMinAggregateOutputType = {
    id: string | null
    challengerId: string | null
    challengeeId: string | null
    leagueId: string | null
    status: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type ChallengeMaxAggregateOutputType = {
    id: string | null
    challengerId: string | null
    challengeeId: string | null
    leagueId: string | null
    status: string | null
    createdAt: Date | null
    expiresAt: Date | null
  }

  export type ChallengeCountAggregateOutputType = {
    id: number
    challengerId: number
    challengeeId: number
    leagueId: number
    status: number
    createdAt: number
    expiresAt: number
    _all: number
  }


  export type ChallengeMinAggregateInputType = {
    id?: true
    challengerId?: true
    challengeeId?: true
    leagueId?: true
    status?: true
    createdAt?: true
    expiresAt?: true
  }

  export type ChallengeMaxAggregateInputType = {
    id?: true
    challengerId?: true
    challengeeId?: true
    leagueId?: true
    status?: true
    createdAt?: true
    expiresAt?: true
  }

  export type ChallengeCountAggregateInputType = {
    id?: true
    challengerId?: true
    challengeeId?: true
    leagueId?: true
    status?: true
    createdAt?: true
    expiresAt?: true
    _all?: true
  }

  export type ChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Challenge to aggregate.
     */
    where?: ChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Challenges to fetch.
     */
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Challenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Challenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Challenges
    **/
    _count?: true | ChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChallengeMaxAggregateInputType
  }

  export type GetChallengeAggregateType<T extends ChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregateChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChallenge[P]>
      : GetScalarType<T[P], AggregateChallenge[P]>
  }




  export type ChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChallengeWhereInput
    orderBy?: ChallengeOrderByWithAggregationInput | ChallengeOrderByWithAggregationInput[]
    by: ChallengeScalarFieldEnum[] | ChallengeScalarFieldEnum
    having?: ChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChallengeCountAggregateInputType | true
    _min?: ChallengeMinAggregateInputType
    _max?: ChallengeMaxAggregateInputType
  }

  export type ChallengeGroupByOutputType = {
    id: string
    challengerId: string
    challengeeId: string
    leagueId: string
    status: string
    createdAt: Date
    expiresAt: Date | null
    _count: ChallengeCountAggregateOutputType | null
    _min: ChallengeMinAggregateOutputType | null
    _max: ChallengeMaxAggregateOutputType | null
  }

  type GetChallengeGroupByPayload<T extends ChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], ChallengeGroupByOutputType[P]>
        }
      >
    >


  export type ChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengerId?: boolean
    challengeeId?: boolean
    leagueId?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
    match?: boolean | Challenge$matchArgs<ExtArgs>
  }, ExtArgs["result"]["challenge"]>

  export type ChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengerId?: boolean
    challengeeId?: boolean
    leagueId?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challenge"]>

  export type ChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengerId?: boolean
    challengeeId?: boolean
    leagueId?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["challenge"]>

  export type ChallengeSelectScalar = {
    id?: boolean
    challengerId?: boolean
    challengeeId?: boolean
    leagueId?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
  }

  export type ChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "challengerId" | "challengeeId" | "leagueId" | "status" | "createdAt" | "expiresAt", ExtArgs["result"]["challenge"]>
  export type ChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
    match?: boolean | Challenge$matchArgs<ExtArgs>
  }
  export type ChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type ChallengeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenger?: boolean | PlayerDefaultArgs<ExtArgs>
    challengee?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }

  export type $ChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Challenge"
    objects: {
      challenger: Prisma.$PlayerPayload<ExtArgs>
      challengee: Prisma.$PlayerPayload<ExtArgs>
      league: Prisma.$LeaguePayload<ExtArgs>
      match: Prisma.$MatchPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      challengerId: string
      challengeeId: string
      leagueId: string
      status: string
      createdAt: Date
      expiresAt: Date | null
    }, ExtArgs["result"]["challenge"]>
    composites: {}
  }

  type ChallengeGetPayload<S extends boolean | null | undefined | ChallengeDefaultArgs> = $Result.GetResult<Prisma.$ChallengePayload, S>

  type ChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChallengeCountAggregateInputType | true
    }

  export interface ChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Challenge'], meta: { name: 'Challenge' } }
    /**
     * Find zero or one Challenge that matches the filter.
     * @param {ChallengeFindUniqueArgs} args - Arguments to find a Challenge
     * @example
     * // Get one Challenge
     * const challenge = await prisma.challenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChallengeFindUniqueArgs>(args: SelectSubset<T, ChallengeFindUniqueArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Challenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChallengeFindUniqueOrThrowArgs} args - Arguments to find a Challenge
     * @example
     * // Get one Challenge
     * const challenge = await prisma.challenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, ChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Challenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeFindFirstArgs} args - Arguments to find a Challenge
     * @example
     * // Get one Challenge
     * const challenge = await prisma.challenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChallengeFindFirstArgs>(args?: SelectSubset<T, ChallengeFindFirstArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Challenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeFindFirstOrThrowArgs} args - Arguments to find a Challenge
     * @example
     * // Get one Challenge
     * const challenge = await prisma.challenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, ChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Challenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Challenges
     * const challenges = await prisma.challenge.findMany()
     * 
     * // Get first 10 Challenges
     * const challenges = await prisma.challenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const challengeWithIdOnly = await prisma.challenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChallengeFindManyArgs>(args?: SelectSubset<T, ChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Challenge.
     * @param {ChallengeCreateArgs} args - Arguments to create a Challenge.
     * @example
     * // Create one Challenge
     * const Challenge = await prisma.challenge.create({
     *   data: {
     *     // ... data to create a Challenge
     *   }
     * })
     * 
     */
    create<T extends ChallengeCreateArgs>(args: SelectSubset<T, ChallengeCreateArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Challenges.
     * @param {ChallengeCreateManyArgs} args - Arguments to create many Challenges.
     * @example
     * // Create many Challenges
     * const challenge = await prisma.challenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChallengeCreateManyArgs>(args?: SelectSubset<T, ChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Challenges and returns the data saved in the database.
     * @param {ChallengeCreateManyAndReturnArgs} args - Arguments to create many Challenges.
     * @example
     * // Create many Challenges
     * const challenge = await prisma.challenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Challenges and only return the `id`
     * const challengeWithIdOnly = await prisma.challenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, ChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Challenge.
     * @param {ChallengeDeleteArgs} args - Arguments to delete one Challenge.
     * @example
     * // Delete one Challenge
     * const Challenge = await prisma.challenge.delete({
     *   where: {
     *     // ... filter to delete one Challenge
     *   }
     * })
     * 
     */
    delete<T extends ChallengeDeleteArgs>(args: SelectSubset<T, ChallengeDeleteArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Challenge.
     * @param {ChallengeUpdateArgs} args - Arguments to update one Challenge.
     * @example
     * // Update one Challenge
     * const challenge = await prisma.challenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChallengeUpdateArgs>(args: SelectSubset<T, ChallengeUpdateArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Challenges.
     * @param {ChallengeDeleteManyArgs} args - Arguments to filter Challenges to delete.
     * @example
     * // Delete a few Challenges
     * const { count } = await prisma.challenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChallengeDeleteManyArgs>(args?: SelectSubset<T, ChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Challenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Challenges
     * const challenge = await prisma.challenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChallengeUpdateManyArgs>(args: SelectSubset<T, ChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Challenges and returns the data updated in the database.
     * @param {ChallengeUpdateManyAndReturnArgs} args - Arguments to update many Challenges.
     * @example
     * // Update many Challenges
     * const challenge = await prisma.challenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Challenges and only return the `id`
     * const challengeWithIdOnly = await prisma.challenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, ChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Challenge.
     * @param {ChallengeUpsertArgs} args - Arguments to update or create a Challenge.
     * @example
     * // Update or create a Challenge
     * const challenge = await prisma.challenge.upsert({
     *   create: {
     *     // ... data to create a Challenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Challenge we want to update
     *   }
     * })
     */
    upsert<T extends ChallengeUpsertArgs>(args: SelectSubset<T, ChallengeUpsertArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Challenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeCountArgs} args - Arguments to filter Challenges to count.
     * @example
     * // Count the number of Challenges
     * const count = await prisma.challenge.count({
     *   where: {
     *     // ... the filter for the Challenges we want to count
     *   }
     * })
    **/
    count<T extends ChallengeCountArgs>(
      args?: Subset<T, ChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Challenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChallengeAggregateArgs>(args: Subset<T, ChallengeAggregateArgs>): Prisma.PrismaPromise<GetChallengeAggregateType<T>>

    /**
     * Group by Challenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChallengeGroupByArgs['orderBy'] }
        : { orderBy?: ChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Challenge model
   */
  readonly fields: ChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Challenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    challenger<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    challengee<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    league<T extends LeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeagueDefaultArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    match<T extends Challenge$matchArgs<ExtArgs> = {}>(args?: Subset<T, Challenge$matchArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Challenge model
   */
  interface ChallengeFieldRefs {
    readonly id: FieldRef<"Challenge", 'String'>
    readonly challengerId: FieldRef<"Challenge", 'String'>
    readonly challengeeId: FieldRef<"Challenge", 'String'>
    readonly leagueId: FieldRef<"Challenge", 'String'>
    readonly status: FieldRef<"Challenge", 'String'>
    readonly createdAt: FieldRef<"Challenge", 'DateTime'>
    readonly expiresAt: FieldRef<"Challenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Challenge findUnique
   */
  export type ChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter, which Challenge to fetch.
     */
    where: ChallengeWhereUniqueInput
  }

  /**
   * Challenge findUniqueOrThrow
   */
  export type ChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter, which Challenge to fetch.
     */
    where: ChallengeWhereUniqueInput
  }

  /**
   * Challenge findFirst
   */
  export type ChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter, which Challenge to fetch.
     */
    where?: ChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Challenges to fetch.
     */
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Challenges.
     */
    cursor?: ChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Challenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Challenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Challenges.
     */
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * Challenge findFirstOrThrow
   */
  export type ChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter, which Challenge to fetch.
     */
    where?: ChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Challenges to fetch.
     */
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Challenges.
     */
    cursor?: ChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Challenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Challenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Challenges.
     */
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * Challenge findMany
   */
  export type ChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter, which Challenges to fetch.
     */
    where?: ChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Challenges to fetch.
     */
    orderBy?: ChallengeOrderByWithRelationInput | ChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Challenges.
     */
    cursor?: ChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Challenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Challenges.
     */
    skip?: number
    distinct?: ChallengeScalarFieldEnum | ChallengeScalarFieldEnum[]
  }

  /**
   * Challenge create
   */
  export type ChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a Challenge.
     */
    data: XOR<ChallengeCreateInput, ChallengeUncheckedCreateInput>
  }

  /**
   * Challenge createMany
   */
  export type ChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Challenges.
     */
    data: ChallengeCreateManyInput | ChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Challenge createManyAndReturn
   */
  export type ChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many Challenges.
     */
    data: ChallengeCreateManyInput | ChallengeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Challenge update
   */
  export type ChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a Challenge.
     */
    data: XOR<ChallengeUpdateInput, ChallengeUncheckedUpdateInput>
    /**
     * Choose, which Challenge to update.
     */
    where: ChallengeWhereUniqueInput
  }

  /**
   * Challenge updateMany
   */
  export type ChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Challenges.
     */
    data: XOR<ChallengeUpdateManyMutationInput, ChallengeUncheckedUpdateManyInput>
    /**
     * Filter which Challenges to update
     */
    where?: ChallengeWhereInput
    /**
     * Limit how many Challenges to update.
     */
    limit?: number
  }

  /**
   * Challenge updateManyAndReturn
   */
  export type ChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * The data used to update Challenges.
     */
    data: XOR<ChallengeUpdateManyMutationInput, ChallengeUncheckedUpdateManyInput>
    /**
     * Filter which Challenges to update
     */
    where?: ChallengeWhereInput
    /**
     * Limit how many Challenges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Challenge upsert
   */
  export type ChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the Challenge to update in case it exists.
     */
    where: ChallengeWhereUniqueInput
    /**
     * In case the Challenge found by the `where` argument doesn't exist, create a new Challenge with this data.
     */
    create: XOR<ChallengeCreateInput, ChallengeUncheckedCreateInput>
    /**
     * In case the Challenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChallengeUpdateInput, ChallengeUncheckedUpdateInput>
  }

  /**
   * Challenge delete
   */
  export type ChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    /**
     * Filter which Challenge to delete.
     */
    where: ChallengeWhereUniqueInput
  }

  /**
   * Challenge deleteMany
   */
  export type ChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Challenges to delete
     */
    where?: ChallengeWhereInput
    /**
     * Limit how many Challenges to delete.
     */
    limit?: number
  }

  /**
   * Challenge.match
   */
  export type Challenge$matchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
  }

  /**
   * Challenge without action
   */
  export type ChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    player1Score: number | null
    player2Score: number | null
  }

  export type MatchSumAggregateOutputType = {
    player1Score: number | null
    player2Score: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    challengeId: string | null
    player1Id: string | null
    player2Id: string | null
    leagueId: string | null
    player1Score: number | null
    player2Score: number | null
    winnerId: string | null
    status: string | null
    reportedBy: string | null
    playedAt: Date | null
    confirmedAt: Date | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    challengeId: string | null
    player1Id: string | null
    player2Id: string | null
    leagueId: string | null
    player1Score: number | null
    player2Score: number | null
    winnerId: string | null
    status: string | null
    reportedBy: string | null
    playedAt: Date | null
    confirmedAt: Date | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    challengeId: number
    player1Id: number
    player2Id: number
    leagueId: number
    player1Score: number
    player2Score: number
    winnerId: number
    status: number
    reportedBy: number
    playedAt: number
    confirmedAt: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    player1Score?: true
    player2Score?: true
  }

  export type MatchSumAggregateInputType = {
    player1Score?: true
    player2Score?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    challengeId?: true
    player1Id?: true
    player2Id?: true
    leagueId?: true
    player1Score?: true
    player2Score?: true
    winnerId?: true
    status?: true
    reportedBy?: true
    playedAt?: true
    confirmedAt?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    challengeId?: true
    player1Id?: true
    player2Id?: true
    leagueId?: true
    player1Score?: true
    player2Score?: true
    winnerId?: true
    status?: true
    reportedBy?: true
    playedAt?: true
    confirmedAt?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    challengeId?: true
    player1Id?: true
    player2Id?: true
    leagueId?: true
    player1Score?: true
    player2Score?: true
    winnerId?: true
    status?: true
    reportedBy?: true
    playedAt?: true
    confirmedAt?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    challengeId: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId: string | null
    status: string
    reportedBy: string | null
    playedAt: Date
    confirmedAt: Date | null
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    player1Id?: boolean
    player2Id?: boolean
    leagueId?: boolean
    player1Score?: boolean
    player2Score?: boolean
    winnerId?: boolean
    status?: boolean
    reportedBy?: boolean
    playedAt?: boolean
    confirmedAt?: boolean
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
    confirmations?: boolean | Match$confirmationsArgs<ExtArgs>
    ratingUpdates?: boolean | Match$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    player1Id?: boolean
    player2Id?: boolean
    leagueId?: boolean
    player1Score?: boolean
    player2Score?: boolean
    winnerId?: boolean
    status?: boolean
    reportedBy?: boolean
    playedAt?: boolean
    confirmedAt?: boolean
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    player1Id?: boolean
    player2Id?: boolean
    leagueId?: boolean
    player1Score?: boolean
    player2Score?: boolean
    winnerId?: boolean
    status?: boolean
    reportedBy?: boolean
    playedAt?: boolean
    confirmedAt?: boolean
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    challengeId?: boolean
    player1Id?: boolean
    player2Id?: boolean
    leagueId?: boolean
    player1Score?: boolean
    player2Score?: boolean
    winnerId?: boolean
    status?: boolean
    reportedBy?: boolean
    playedAt?: boolean
    confirmedAt?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "challengeId" | "player1Id" | "player2Id" | "leagueId" | "player1Score" | "player2Score" | "winnerId" | "status" | "reportedBy" | "playedAt" | "confirmedAt", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
    confirmations?: boolean | Match$confirmationsArgs<ExtArgs>
    ratingUpdates?: boolean | Match$ratingUpdatesArgs<ExtArgs>
    _count?: boolean | MatchCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | Match$challengeArgs<ExtArgs>
    player1?: boolean | PlayerDefaultArgs<ExtArgs>
    player2?: boolean | PlayerDefaultArgs<ExtArgs>
    winner?: boolean | Match$winnerArgs<ExtArgs>
    reporter?: boolean | Match$reporterArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      challenge: Prisma.$ChallengePayload<ExtArgs> | null
      player1: Prisma.$PlayerPayload<ExtArgs>
      player2: Prisma.$PlayerPayload<ExtArgs>
      winner: Prisma.$PlayerPayload<ExtArgs> | null
      reporter: Prisma.$PlayerPayload<ExtArgs> | null
      league: Prisma.$LeaguePayload<ExtArgs>
      confirmations: Prisma.$MatchConfirmationPayload<ExtArgs>[]
      ratingUpdates: Prisma.$RatingUpdatePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      challengeId: string | null
      player1Id: string
      player2Id: string
      leagueId: string
      player1Score: number
      player2Score: number
      winnerId: string | null
      status: string
      reportedBy: string | null
      playedAt: Date
      confirmedAt: Date | null
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    challenge<T extends Match$challengeArgs<ExtArgs> = {}>(args?: Subset<T, Match$challengeArgs<ExtArgs>>): Prisma__ChallengeClient<$Result.GetResult<Prisma.$ChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    player1<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    player2<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    winner<T extends Match$winnerArgs<ExtArgs> = {}>(args?: Subset<T, Match$winnerArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reporter<T extends Match$reporterArgs<ExtArgs> = {}>(args?: Subset<T, Match$reporterArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    league<T extends LeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeagueDefaultArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    confirmations<T extends Match$confirmationsArgs<ExtArgs> = {}>(args?: Subset<T, Match$confirmationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ratingUpdates<T extends Match$ratingUpdatesArgs<ExtArgs> = {}>(args?: Subset<T, Match$ratingUpdatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly challengeId: FieldRef<"Match", 'String'>
    readonly player1Id: FieldRef<"Match", 'String'>
    readonly player2Id: FieldRef<"Match", 'String'>
    readonly leagueId: FieldRef<"Match", 'String'>
    readonly player1Score: FieldRef<"Match", 'Int'>
    readonly player2Score: FieldRef<"Match", 'Int'>
    readonly winnerId: FieldRef<"Match", 'String'>
    readonly status: FieldRef<"Match", 'String'>
    readonly reportedBy: FieldRef<"Match", 'String'>
    readonly playedAt: FieldRef<"Match", 'DateTime'>
    readonly confirmedAt: FieldRef<"Match", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.challenge
   */
  export type Match$challengeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Challenge
     */
    select?: ChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Challenge
     */
    omit?: ChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChallengeInclude<ExtArgs> | null
    where?: ChallengeWhereInput
  }

  /**
   * Match.winner
   */
  export type Match$winnerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
  }

  /**
   * Match.reporter
   */
  export type Match$reporterArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Player
     */
    select?: PlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Player
     */
    omit?: PlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PlayerInclude<ExtArgs> | null
    where?: PlayerWhereInput
  }

  /**
   * Match.confirmations
   */
  export type Match$confirmationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    where?: MatchConfirmationWhereInput
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    cursor?: MatchConfirmationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchConfirmationScalarFieldEnum | MatchConfirmationScalarFieldEnum[]
  }

  /**
   * Match.ratingUpdates
   */
  export type Match$ratingUpdatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    where?: RatingUpdateWhereInput
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    cursor?: RatingUpdateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Model MatchConfirmation
   */

  export type AggregateMatchConfirmation = {
    _count: MatchConfirmationCountAggregateOutputType | null
    _avg: MatchConfirmationAvgAggregateOutputType | null
    _sum: MatchConfirmationSumAggregateOutputType | null
    _min: MatchConfirmationMinAggregateOutputType | null
    _max: MatchConfirmationMaxAggregateOutputType | null
  }

  export type MatchConfirmationAvgAggregateOutputType = {
    confirmedScore1: number | null
    confirmedScore2: number | null
  }

  export type MatchConfirmationSumAggregateOutputType = {
    confirmedScore1: number | null
    confirmedScore2: number | null
  }

  export type MatchConfirmationMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    playerId: string | null
    action: string | null
    confirmedScore1: number | null
    confirmedScore2: number | null
    disputeReason: string | null
    createdAt: Date | null
  }

  export type MatchConfirmationMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    playerId: string | null
    action: string | null
    confirmedScore1: number | null
    confirmedScore2: number | null
    disputeReason: string | null
    createdAt: Date | null
  }

  export type MatchConfirmationCountAggregateOutputType = {
    id: number
    matchId: number
    playerId: number
    action: number
    confirmedScore1: number
    confirmedScore2: number
    disputeReason: number
    createdAt: number
    _all: number
  }


  export type MatchConfirmationAvgAggregateInputType = {
    confirmedScore1?: true
    confirmedScore2?: true
  }

  export type MatchConfirmationSumAggregateInputType = {
    confirmedScore1?: true
    confirmedScore2?: true
  }

  export type MatchConfirmationMinAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    action?: true
    confirmedScore1?: true
    confirmedScore2?: true
    disputeReason?: true
    createdAt?: true
  }

  export type MatchConfirmationMaxAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    action?: true
    confirmedScore1?: true
    confirmedScore2?: true
    disputeReason?: true
    createdAt?: true
  }

  export type MatchConfirmationCountAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    action?: true
    confirmedScore1?: true
    confirmedScore2?: true
    disputeReason?: true
    createdAt?: true
    _all?: true
  }

  export type MatchConfirmationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchConfirmation to aggregate.
     */
    where?: MatchConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchConfirmations to fetch.
     */
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchConfirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchConfirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MatchConfirmations
    **/
    _count?: true | MatchConfirmationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchConfirmationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchConfirmationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchConfirmationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchConfirmationMaxAggregateInputType
  }

  export type GetMatchConfirmationAggregateType<T extends MatchConfirmationAggregateArgs> = {
        [P in keyof T & keyof AggregateMatchConfirmation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatchConfirmation[P]>
      : GetScalarType<T[P], AggregateMatchConfirmation[P]>
  }




  export type MatchConfirmationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchConfirmationWhereInput
    orderBy?: MatchConfirmationOrderByWithAggregationInput | MatchConfirmationOrderByWithAggregationInput[]
    by: MatchConfirmationScalarFieldEnum[] | MatchConfirmationScalarFieldEnum
    having?: MatchConfirmationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchConfirmationCountAggregateInputType | true
    _avg?: MatchConfirmationAvgAggregateInputType
    _sum?: MatchConfirmationSumAggregateInputType
    _min?: MatchConfirmationMinAggregateInputType
    _max?: MatchConfirmationMaxAggregateInputType
  }

  export type MatchConfirmationGroupByOutputType = {
    id: string
    matchId: string
    playerId: string
    action: string
    confirmedScore1: number | null
    confirmedScore2: number | null
    disputeReason: string | null
    createdAt: Date
    _count: MatchConfirmationCountAggregateOutputType | null
    _avg: MatchConfirmationAvgAggregateOutputType | null
    _sum: MatchConfirmationSumAggregateOutputType | null
    _min: MatchConfirmationMinAggregateOutputType | null
    _max: MatchConfirmationMaxAggregateOutputType | null
  }

  type GetMatchConfirmationGroupByPayload<T extends MatchConfirmationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchConfirmationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchConfirmationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchConfirmationGroupByOutputType[P]>
            : GetScalarType<T[P], MatchConfirmationGroupByOutputType[P]>
        }
      >
    >


  export type MatchConfirmationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    action?: boolean
    confirmedScore1?: boolean
    confirmedScore2?: boolean
    disputeReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchConfirmation"]>

  export type MatchConfirmationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    action?: boolean
    confirmedScore1?: boolean
    confirmedScore2?: boolean
    disputeReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchConfirmation"]>

  export type MatchConfirmationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    action?: boolean
    confirmedScore1?: boolean
    confirmedScore2?: boolean
    disputeReason?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["matchConfirmation"]>

  export type MatchConfirmationSelectScalar = {
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    action?: boolean
    confirmedScore1?: boolean
    confirmedScore2?: boolean
    disputeReason?: boolean
    createdAt?: boolean
  }

  export type MatchConfirmationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "playerId" | "action" | "confirmedScore1" | "confirmedScore2" | "disputeReason" | "createdAt", ExtArgs["result"]["matchConfirmation"]>
  export type MatchConfirmationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type MatchConfirmationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }
  export type MatchConfirmationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
  }

  export type $MatchConfirmationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MatchConfirmation"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
      player: Prisma.$PlayerPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      playerId: string
      action: string
      confirmedScore1: number | null
      confirmedScore2: number | null
      disputeReason: string | null
      createdAt: Date
    }, ExtArgs["result"]["matchConfirmation"]>
    composites: {}
  }

  type MatchConfirmationGetPayload<S extends boolean | null | undefined | MatchConfirmationDefaultArgs> = $Result.GetResult<Prisma.$MatchConfirmationPayload, S>

  type MatchConfirmationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchConfirmationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchConfirmationCountAggregateInputType | true
    }

  export interface MatchConfirmationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MatchConfirmation'], meta: { name: 'MatchConfirmation' } }
    /**
     * Find zero or one MatchConfirmation that matches the filter.
     * @param {MatchConfirmationFindUniqueArgs} args - Arguments to find a MatchConfirmation
     * @example
     * // Get one MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchConfirmationFindUniqueArgs>(args: SelectSubset<T, MatchConfirmationFindUniqueArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MatchConfirmation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchConfirmationFindUniqueOrThrowArgs} args - Arguments to find a MatchConfirmation
     * @example
     * // Get one MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchConfirmationFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchConfirmationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchConfirmation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationFindFirstArgs} args - Arguments to find a MatchConfirmation
     * @example
     * // Get one MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchConfirmationFindFirstArgs>(args?: SelectSubset<T, MatchConfirmationFindFirstArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MatchConfirmation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationFindFirstOrThrowArgs} args - Arguments to find a MatchConfirmation
     * @example
     * // Get one MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchConfirmationFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchConfirmationFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MatchConfirmations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MatchConfirmations
     * const matchConfirmations = await prisma.matchConfirmation.findMany()
     * 
     * // Get first 10 MatchConfirmations
     * const matchConfirmations = await prisma.matchConfirmation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchConfirmationWithIdOnly = await prisma.matchConfirmation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchConfirmationFindManyArgs>(args?: SelectSubset<T, MatchConfirmationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MatchConfirmation.
     * @param {MatchConfirmationCreateArgs} args - Arguments to create a MatchConfirmation.
     * @example
     * // Create one MatchConfirmation
     * const MatchConfirmation = await prisma.matchConfirmation.create({
     *   data: {
     *     // ... data to create a MatchConfirmation
     *   }
     * })
     * 
     */
    create<T extends MatchConfirmationCreateArgs>(args: SelectSubset<T, MatchConfirmationCreateArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MatchConfirmations.
     * @param {MatchConfirmationCreateManyArgs} args - Arguments to create many MatchConfirmations.
     * @example
     * // Create many MatchConfirmations
     * const matchConfirmation = await prisma.matchConfirmation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchConfirmationCreateManyArgs>(args?: SelectSubset<T, MatchConfirmationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MatchConfirmations and returns the data saved in the database.
     * @param {MatchConfirmationCreateManyAndReturnArgs} args - Arguments to create many MatchConfirmations.
     * @example
     * // Create many MatchConfirmations
     * const matchConfirmation = await prisma.matchConfirmation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MatchConfirmations and only return the `id`
     * const matchConfirmationWithIdOnly = await prisma.matchConfirmation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchConfirmationCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchConfirmationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MatchConfirmation.
     * @param {MatchConfirmationDeleteArgs} args - Arguments to delete one MatchConfirmation.
     * @example
     * // Delete one MatchConfirmation
     * const MatchConfirmation = await prisma.matchConfirmation.delete({
     *   where: {
     *     // ... filter to delete one MatchConfirmation
     *   }
     * })
     * 
     */
    delete<T extends MatchConfirmationDeleteArgs>(args: SelectSubset<T, MatchConfirmationDeleteArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MatchConfirmation.
     * @param {MatchConfirmationUpdateArgs} args - Arguments to update one MatchConfirmation.
     * @example
     * // Update one MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchConfirmationUpdateArgs>(args: SelectSubset<T, MatchConfirmationUpdateArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MatchConfirmations.
     * @param {MatchConfirmationDeleteManyArgs} args - Arguments to filter MatchConfirmations to delete.
     * @example
     * // Delete a few MatchConfirmations
     * const { count } = await prisma.matchConfirmation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchConfirmationDeleteManyArgs>(args?: SelectSubset<T, MatchConfirmationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchConfirmations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MatchConfirmations
     * const matchConfirmation = await prisma.matchConfirmation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchConfirmationUpdateManyArgs>(args: SelectSubset<T, MatchConfirmationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MatchConfirmations and returns the data updated in the database.
     * @param {MatchConfirmationUpdateManyAndReturnArgs} args - Arguments to update many MatchConfirmations.
     * @example
     * // Update many MatchConfirmations
     * const matchConfirmation = await prisma.matchConfirmation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MatchConfirmations and only return the `id`
     * const matchConfirmationWithIdOnly = await prisma.matchConfirmation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchConfirmationUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchConfirmationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MatchConfirmation.
     * @param {MatchConfirmationUpsertArgs} args - Arguments to update or create a MatchConfirmation.
     * @example
     * // Update or create a MatchConfirmation
     * const matchConfirmation = await prisma.matchConfirmation.upsert({
     *   create: {
     *     // ... data to create a MatchConfirmation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MatchConfirmation we want to update
     *   }
     * })
     */
    upsert<T extends MatchConfirmationUpsertArgs>(args: SelectSubset<T, MatchConfirmationUpsertArgs<ExtArgs>>): Prisma__MatchConfirmationClient<$Result.GetResult<Prisma.$MatchConfirmationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MatchConfirmations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationCountArgs} args - Arguments to filter MatchConfirmations to count.
     * @example
     * // Count the number of MatchConfirmations
     * const count = await prisma.matchConfirmation.count({
     *   where: {
     *     // ... the filter for the MatchConfirmations we want to count
     *   }
     * })
    **/
    count<T extends MatchConfirmationCountArgs>(
      args?: Subset<T, MatchConfirmationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchConfirmationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MatchConfirmation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchConfirmationAggregateArgs>(args: Subset<T, MatchConfirmationAggregateArgs>): Prisma.PrismaPromise<GetMatchConfirmationAggregateType<T>>

    /**
     * Group by MatchConfirmation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchConfirmationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchConfirmationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchConfirmationGroupByArgs['orderBy'] }
        : { orderBy?: MatchConfirmationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchConfirmationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchConfirmationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MatchConfirmation model
   */
  readonly fields: MatchConfirmationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MatchConfirmation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchConfirmationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MatchConfirmation model
   */
  interface MatchConfirmationFieldRefs {
    readonly id: FieldRef<"MatchConfirmation", 'String'>
    readonly matchId: FieldRef<"MatchConfirmation", 'String'>
    readonly playerId: FieldRef<"MatchConfirmation", 'String'>
    readonly action: FieldRef<"MatchConfirmation", 'String'>
    readonly confirmedScore1: FieldRef<"MatchConfirmation", 'Int'>
    readonly confirmedScore2: FieldRef<"MatchConfirmation", 'Int'>
    readonly disputeReason: FieldRef<"MatchConfirmation", 'String'>
    readonly createdAt: FieldRef<"MatchConfirmation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MatchConfirmation findUnique
   */
  export type MatchConfirmationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which MatchConfirmation to fetch.
     */
    where: MatchConfirmationWhereUniqueInput
  }

  /**
   * MatchConfirmation findUniqueOrThrow
   */
  export type MatchConfirmationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which MatchConfirmation to fetch.
     */
    where: MatchConfirmationWhereUniqueInput
  }

  /**
   * MatchConfirmation findFirst
   */
  export type MatchConfirmationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which MatchConfirmation to fetch.
     */
    where?: MatchConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchConfirmations to fetch.
     */
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchConfirmations.
     */
    cursor?: MatchConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchConfirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchConfirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchConfirmations.
     */
    distinct?: MatchConfirmationScalarFieldEnum | MatchConfirmationScalarFieldEnum[]
  }

  /**
   * MatchConfirmation findFirstOrThrow
   */
  export type MatchConfirmationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which MatchConfirmation to fetch.
     */
    where?: MatchConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchConfirmations to fetch.
     */
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MatchConfirmations.
     */
    cursor?: MatchConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchConfirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchConfirmations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MatchConfirmations.
     */
    distinct?: MatchConfirmationScalarFieldEnum | MatchConfirmationScalarFieldEnum[]
  }

  /**
   * MatchConfirmation findMany
   */
  export type MatchConfirmationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter, which MatchConfirmations to fetch.
     */
    where?: MatchConfirmationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MatchConfirmations to fetch.
     */
    orderBy?: MatchConfirmationOrderByWithRelationInput | MatchConfirmationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MatchConfirmations.
     */
    cursor?: MatchConfirmationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MatchConfirmations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MatchConfirmations.
     */
    skip?: number
    distinct?: MatchConfirmationScalarFieldEnum | MatchConfirmationScalarFieldEnum[]
  }

  /**
   * MatchConfirmation create
   */
  export type MatchConfirmationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * The data needed to create a MatchConfirmation.
     */
    data: XOR<MatchConfirmationCreateInput, MatchConfirmationUncheckedCreateInput>
  }

  /**
   * MatchConfirmation createMany
   */
  export type MatchConfirmationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MatchConfirmations.
     */
    data: MatchConfirmationCreateManyInput | MatchConfirmationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MatchConfirmation createManyAndReturn
   */
  export type MatchConfirmationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * The data used to create many MatchConfirmations.
     */
    data: MatchConfirmationCreateManyInput | MatchConfirmationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchConfirmation update
   */
  export type MatchConfirmationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * The data needed to update a MatchConfirmation.
     */
    data: XOR<MatchConfirmationUpdateInput, MatchConfirmationUncheckedUpdateInput>
    /**
     * Choose, which MatchConfirmation to update.
     */
    where: MatchConfirmationWhereUniqueInput
  }

  /**
   * MatchConfirmation updateMany
   */
  export type MatchConfirmationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MatchConfirmations.
     */
    data: XOR<MatchConfirmationUpdateManyMutationInput, MatchConfirmationUncheckedUpdateManyInput>
    /**
     * Filter which MatchConfirmations to update
     */
    where?: MatchConfirmationWhereInput
    /**
     * Limit how many MatchConfirmations to update.
     */
    limit?: number
  }

  /**
   * MatchConfirmation updateManyAndReturn
   */
  export type MatchConfirmationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * The data used to update MatchConfirmations.
     */
    data: XOR<MatchConfirmationUpdateManyMutationInput, MatchConfirmationUncheckedUpdateManyInput>
    /**
     * Filter which MatchConfirmations to update
     */
    where?: MatchConfirmationWhereInput
    /**
     * Limit how many MatchConfirmations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MatchConfirmation upsert
   */
  export type MatchConfirmationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * The filter to search for the MatchConfirmation to update in case it exists.
     */
    where: MatchConfirmationWhereUniqueInput
    /**
     * In case the MatchConfirmation found by the `where` argument doesn't exist, create a new MatchConfirmation with this data.
     */
    create: XOR<MatchConfirmationCreateInput, MatchConfirmationUncheckedCreateInput>
    /**
     * In case the MatchConfirmation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchConfirmationUpdateInput, MatchConfirmationUncheckedUpdateInput>
  }

  /**
   * MatchConfirmation delete
   */
  export type MatchConfirmationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
    /**
     * Filter which MatchConfirmation to delete.
     */
    where: MatchConfirmationWhereUniqueInput
  }

  /**
   * MatchConfirmation deleteMany
   */
  export type MatchConfirmationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MatchConfirmations to delete
     */
    where?: MatchConfirmationWhereInput
    /**
     * Limit how many MatchConfirmations to delete.
     */
    limit?: number
  }

  /**
   * MatchConfirmation without action
   */
  export type MatchConfirmationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MatchConfirmation
     */
    select?: MatchConfirmationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MatchConfirmation
     */
    omit?: MatchConfirmationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchConfirmationInclude<ExtArgs> | null
  }


  /**
   * Model RatingUpdate
   */

  export type AggregateRatingUpdate = {
    _count: RatingUpdateCountAggregateOutputType | null
    _avg: RatingUpdateAvgAggregateOutputType | null
    _sum: RatingUpdateSumAggregateOutputType | null
    _min: RatingUpdateMinAggregateOutputType | null
    _max: RatingUpdateMaxAggregateOutputType | null
  }

  export type RatingUpdateAvgAggregateOutputType = {
    oldRating: number | null
    newRating: number | null
    change: number | null
  }

  export type RatingUpdateSumAggregateOutputType = {
    oldRating: number | null
    newRating: number | null
    change: number | null
  }

  export type RatingUpdateMinAggregateOutputType = {
    id: string | null
    matchId: string | null
    playerId: string | null
    leagueId: string | null
    oldRating: number | null
    newRating: number | null
    change: number | null
    createdAt: Date | null
  }

  export type RatingUpdateMaxAggregateOutputType = {
    id: string | null
    matchId: string | null
    playerId: string | null
    leagueId: string | null
    oldRating: number | null
    newRating: number | null
    change: number | null
    createdAt: Date | null
  }

  export type RatingUpdateCountAggregateOutputType = {
    id: number
    matchId: number
    playerId: number
    leagueId: number
    oldRating: number
    newRating: number
    change: number
    createdAt: number
    _all: number
  }


  export type RatingUpdateAvgAggregateInputType = {
    oldRating?: true
    newRating?: true
    change?: true
  }

  export type RatingUpdateSumAggregateInputType = {
    oldRating?: true
    newRating?: true
    change?: true
  }

  export type RatingUpdateMinAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    leagueId?: true
    oldRating?: true
    newRating?: true
    change?: true
    createdAt?: true
  }

  export type RatingUpdateMaxAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    leagueId?: true
    oldRating?: true
    newRating?: true
    change?: true
    createdAt?: true
  }

  export type RatingUpdateCountAggregateInputType = {
    id?: true
    matchId?: true
    playerId?: true
    leagueId?: true
    oldRating?: true
    newRating?: true
    change?: true
    createdAt?: true
    _all?: true
  }

  export type RatingUpdateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RatingUpdate to aggregate.
     */
    where?: RatingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RatingUpdates to fetch.
     */
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RatingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RatingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RatingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RatingUpdates
    **/
    _count?: true | RatingUpdateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RatingUpdateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RatingUpdateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RatingUpdateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RatingUpdateMaxAggregateInputType
  }

  export type GetRatingUpdateAggregateType<T extends RatingUpdateAggregateArgs> = {
        [P in keyof T & keyof AggregateRatingUpdate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRatingUpdate[P]>
      : GetScalarType<T[P], AggregateRatingUpdate[P]>
  }




  export type RatingUpdateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RatingUpdateWhereInput
    orderBy?: RatingUpdateOrderByWithAggregationInput | RatingUpdateOrderByWithAggregationInput[]
    by: RatingUpdateScalarFieldEnum[] | RatingUpdateScalarFieldEnum
    having?: RatingUpdateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RatingUpdateCountAggregateInputType | true
    _avg?: RatingUpdateAvgAggregateInputType
    _sum?: RatingUpdateSumAggregateInputType
    _min?: RatingUpdateMinAggregateInputType
    _max?: RatingUpdateMaxAggregateInputType
  }

  export type RatingUpdateGroupByOutputType = {
    id: string
    matchId: string
    playerId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt: Date
    _count: RatingUpdateCountAggregateOutputType | null
    _avg: RatingUpdateAvgAggregateOutputType | null
    _sum: RatingUpdateSumAggregateOutputType | null
    _min: RatingUpdateMinAggregateOutputType | null
    _max: RatingUpdateMaxAggregateOutputType | null
  }

  type GetRatingUpdateGroupByPayload<T extends RatingUpdateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RatingUpdateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RatingUpdateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RatingUpdateGroupByOutputType[P]>
            : GetScalarType<T[P], RatingUpdateGroupByOutputType[P]>
        }
      >
    >


  export type RatingUpdateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    leagueId?: boolean
    oldRating?: boolean
    newRating?: boolean
    change?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ratingUpdate"]>

  export type RatingUpdateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    leagueId?: boolean
    oldRating?: boolean
    newRating?: boolean
    change?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ratingUpdate"]>

  export type RatingUpdateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    leagueId?: boolean
    oldRating?: boolean
    newRating?: boolean
    change?: boolean
    createdAt?: boolean
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ratingUpdate"]>

  export type RatingUpdateSelectScalar = {
    id?: boolean
    matchId?: boolean
    playerId?: boolean
    leagueId?: boolean
    oldRating?: boolean
    newRating?: boolean
    change?: boolean
    createdAt?: boolean
  }

  export type RatingUpdateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "matchId" | "playerId" | "leagueId" | "oldRating" | "newRating" | "change" | "createdAt", ExtArgs["result"]["ratingUpdate"]>
  export type RatingUpdateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type RatingUpdateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }
  export type RatingUpdateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    match?: boolean | MatchDefaultArgs<ExtArgs>
    player?: boolean | PlayerDefaultArgs<ExtArgs>
    league?: boolean | LeagueDefaultArgs<ExtArgs>
  }

  export type $RatingUpdatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RatingUpdate"
    objects: {
      match: Prisma.$MatchPayload<ExtArgs>
      player: Prisma.$PlayerPayload<ExtArgs>
      league: Prisma.$LeaguePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      matchId: string
      playerId: string
      leagueId: string
      oldRating: number
      newRating: number
      change: number
      createdAt: Date
    }, ExtArgs["result"]["ratingUpdate"]>
    composites: {}
  }

  type RatingUpdateGetPayload<S extends boolean | null | undefined | RatingUpdateDefaultArgs> = $Result.GetResult<Prisma.$RatingUpdatePayload, S>

  type RatingUpdateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RatingUpdateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RatingUpdateCountAggregateInputType | true
    }

  export interface RatingUpdateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RatingUpdate'], meta: { name: 'RatingUpdate' } }
    /**
     * Find zero or one RatingUpdate that matches the filter.
     * @param {RatingUpdateFindUniqueArgs} args - Arguments to find a RatingUpdate
     * @example
     * // Get one RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RatingUpdateFindUniqueArgs>(args: SelectSubset<T, RatingUpdateFindUniqueArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RatingUpdate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RatingUpdateFindUniqueOrThrowArgs} args - Arguments to find a RatingUpdate
     * @example
     * // Get one RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RatingUpdateFindUniqueOrThrowArgs>(args: SelectSubset<T, RatingUpdateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RatingUpdate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateFindFirstArgs} args - Arguments to find a RatingUpdate
     * @example
     * // Get one RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RatingUpdateFindFirstArgs>(args?: SelectSubset<T, RatingUpdateFindFirstArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RatingUpdate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateFindFirstOrThrowArgs} args - Arguments to find a RatingUpdate
     * @example
     * // Get one RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RatingUpdateFindFirstOrThrowArgs>(args?: SelectSubset<T, RatingUpdateFindFirstOrThrowArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RatingUpdates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RatingUpdates
     * const ratingUpdates = await prisma.ratingUpdate.findMany()
     * 
     * // Get first 10 RatingUpdates
     * const ratingUpdates = await prisma.ratingUpdate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ratingUpdateWithIdOnly = await prisma.ratingUpdate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RatingUpdateFindManyArgs>(args?: SelectSubset<T, RatingUpdateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RatingUpdate.
     * @param {RatingUpdateCreateArgs} args - Arguments to create a RatingUpdate.
     * @example
     * // Create one RatingUpdate
     * const RatingUpdate = await prisma.ratingUpdate.create({
     *   data: {
     *     // ... data to create a RatingUpdate
     *   }
     * })
     * 
     */
    create<T extends RatingUpdateCreateArgs>(args: SelectSubset<T, RatingUpdateCreateArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RatingUpdates.
     * @param {RatingUpdateCreateManyArgs} args - Arguments to create many RatingUpdates.
     * @example
     * // Create many RatingUpdates
     * const ratingUpdate = await prisma.ratingUpdate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RatingUpdateCreateManyArgs>(args?: SelectSubset<T, RatingUpdateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RatingUpdates and returns the data saved in the database.
     * @param {RatingUpdateCreateManyAndReturnArgs} args - Arguments to create many RatingUpdates.
     * @example
     * // Create many RatingUpdates
     * const ratingUpdate = await prisma.ratingUpdate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RatingUpdates and only return the `id`
     * const ratingUpdateWithIdOnly = await prisma.ratingUpdate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RatingUpdateCreateManyAndReturnArgs>(args?: SelectSubset<T, RatingUpdateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RatingUpdate.
     * @param {RatingUpdateDeleteArgs} args - Arguments to delete one RatingUpdate.
     * @example
     * // Delete one RatingUpdate
     * const RatingUpdate = await prisma.ratingUpdate.delete({
     *   where: {
     *     // ... filter to delete one RatingUpdate
     *   }
     * })
     * 
     */
    delete<T extends RatingUpdateDeleteArgs>(args: SelectSubset<T, RatingUpdateDeleteArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RatingUpdate.
     * @param {RatingUpdateUpdateArgs} args - Arguments to update one RatingUpdate.
     * @example
     * // Update one RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RatingUpdateUpdateArgs>(args: SelectSubset<T, RatingUpdateUpdateArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RatingUpdates.
     * @param {RatingUpdateDeleteManyArgs} args - Arguments to filter RatingUpdates to delete.
     * @example
     * // Delete a few RatingUpdates
     * const { count } = await prisma.ratingUpdate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RatingUpdateDeleteManyArgs>(args?: SelectSubset<T, RatingUpdateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RatingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RatingUpdates
     * const ratingUpdate = await prisma.ratingUpdate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RatingUpdateUpdateManyArgs>(args: SelectSubset<T, RatingUpdateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RatingUpdates and returns the data updated in the database.
     * @param {RatingUpdateUpdateManyAndReturnArgs} args - Arguments to update many RatingUpdates.
     * @example
     * // Update many RatingUpdates
     * const ratingUpdate = await prisma.ratingUpdate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RatingUpdates and only return the `id`
     * const ratingUpdateWithIdOnly = await prisma.ratingUpdate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RatingUpdateUpdateManyAndReturnArgs>(args: SelectSubset<T, RatingUpdateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RatingUpdate.
     * @param {RatingUpdateUpsertArgs} args - Arguments to update or create a RatingUpdate.
     * @example
     * // Update or create a RatingUpdate
     * const ratingUpdate = await prisma.ratingUpdate.upsert({
     *   create: {
     *     // ... data to create a RatingUpdate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RatingUpdate we want to update
     *   }
     * })
     */
    upsert<T extends RatingUpdateUpsertArgs>(args: SelectSubset<T, RatingUpdateUpsertArgs<ExtArgs>>): Prisma__RatingUpdateClient<$Result.GetResult<Prisma.$RatingUpdatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RatingUpdates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateCountArgs} args - Arguments to filter RatingUpdates to count.
     * @example
     * // Count the number of RatingUpdates
     * const count = await prisma.ratingUpdate.count({
     *   where: {
     *     // ... the filter for the RatingUpdates we want to count
     *   }
     * })
    **/
    count<T extends RatingUpdateCountArgs>(
      args?: Subset<T, RatingUpdateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RatingUpdateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RatingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RatingUpdateAggregateArgs>(args: Subset<T, RatingUpdateAggregateArgs>): Prisma.PrismaPromise<GetRatingUpdateAggregateType<T>>

    /**
     * Group by RatingUpdate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RatingUpdateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RatingUpdateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RatingUpdateGroupByArgs['orderBy'] }
        : { orderBy?: RatingUpdateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RatingUpdateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRatingUpdateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RatingUpdate model
   */
  readonly fields: RatingUpdateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RatingUpdate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RatingUpdateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    match<T extends MatchDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MatchDefaultArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    player<T extends PlayerDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PlayerDefaultArgs<ExtArgs>>): Prisma__PlayerClient<$Result.GetResult<Prisma.$PlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    league<T extends LeagueDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeagueDefaultArgs<ExtArgs>>): Prisma__LeagueClient<$Result.GetResult<Prisma.$LeaguePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RatingUpdate model
   */
  interface RatingUpdateFieldRefs {
    readonly id: FieldRef<"RatingUpdate", 'String'>
    readonly matchId: FieldRef<"RatingUpdate", 'String'>
    readonly playerId: FieldRef<"RatingUpdate", 'String'>
    readonly leagueId: FieldRef<"RatingUpdate", 'String'>
    readonly oldRating: FieldRef<"RatingUpdate", 'Int'>
    readonly newRating: FieldRef<"RatingUpdate", 'Int'>
    readonly change: FieldRef<"RatingUpdate", 'Int'>
    readonly createdAt: FieldRef<"RatingUpdate", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * RatingUpdate findUnique
   */
  export type RatingUpdateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which RatingUpdate to fetch.
     */
    where: RatingUpdateWhereUniqueInput
  }

  /**
   * RatingUpdate findUniqueOrThrow
   */
  export type RatingUpdateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which RatingUpdate to fetch.
     */
    where: RatingUpdateWhereUniqueInput
  }

  /**
   * RatingUpdate findFirst
   */
  export type RatingUpdateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which RatingUpdate to fetch.
     */
    where?: RatingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RatingUpdates to fetch.
     */
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RatingUpdates.
     */
    cursor?: RatingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RatingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RatingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RatingUpdates.
     */
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * RatingUpdate findFirstOrThrow
   */
  export type RatingUpdateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which RatingUpdate to fetch.
     */
    where?: RatingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RatingUpdates to fetch.
     */
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RatingUpdates.
     */
    cursor?: RatingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RatingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RatingUpdates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RatingUpdates.
     */
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * RatingUpdate findMany
   */
  export type RatingUpdateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter, which RatingUpdates to fetch.
     */
    where?: RatingUpdateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RatingUpdates to fetch.
     */
    orderBy?: RatingUpdateOrderByWithRelationInput | RatingUpdateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RatingUpdates.
     */
    cursor?: RatingUpdateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RatingUpdates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RatingUpdates.
     */
    skip?: number
    distinct?: RatingUpdateScalarFieldEnum | RatingUpdateScalarFieldEnum[]
  }

  /**
   * RatingUpdate create
   */
  export type RatingUpdateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to create a RatingUpdate.
     */
    data: XOR<RatingUpdateCreateInput, RatingUpdateUncheckedCreateInput>
  }

  /**
   * RatingUpdate createMany
   */
  export type RatingUpdateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RatingUpdates.
     */
    data: RatingUpdateCreateManyInput | RatingUpdateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RatingUpdate createManyAndReturn
   */
  export type RatingUpdateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * The data used to create many RatingUpdates.
     */
    data: RatingUpdateCreateManyInput | RatingUpdateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RatingUpdate update
   */
  export type RatingUpdateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * The data needed to update a RatingUpdate.
     */
    data: XOR<RatingUpdateUpdateInput, RatingUpdateUncheckedUpdateInput>
    /**
     * Choose, which RatingUpdate to update.
     */
    where: RatingUpdateWhereUniqueInput
  }

  /**
   * RatingUpdate updateMany
   */
  export type RatingUpdateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RatingUpdates.
     */
    data: XOR<RatingUpdateUpdateManyMutationInput, RatingUpdateUncheckedUpdateManyInput>
    /**
     * Filter which RatingUpdates to update
     */
    where?: RatingUpdateWhereInput
    /**
     * Limit how many RatingUpdates to update.
     */
    limit?: number
  }

  /**
   * RatingUpdate updateManyAndReturn
   */
  export type RatingUpdateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * The data used to update RatingUpdates.
     */
    data: XOR<RatingUpdateUpdateManyMutationInput, RatingUpdateUncheckedUpdateManyInput>
    /**
     * Filter which RatingUpdates to update
     */
    where?: RatingUpdateWhereInput
    /**
     * Limit how many RatingUpdates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RatingUpdate upsert
   */
  export type RatingUpdateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * The filter to search for the RatingUpdate to update in case it exists.
     */
    where: RatingUpdateWhereUniqueInput
    /**
     * In case the RatingUpdate found by the `where` argument doesn't exist, create a new RatingUpdate with this data.
     */
    create: XOR<RatingUpdateCreateInput, RatingUpdateUncheckedCreateInput>
    /**
     * In case the RatingUpdate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RatingUpdateUpdateInput, RatingUpdateUncheckedUpdateInput>
  }

  /**
   * RatingUpdate delete
   */
  export type RatingUpdateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
    /**
     * Filter which RatingUpdate to delete.
     */
    where: RatingUpdateWhereUniqueInput
  }

  /**
   * RatingUpdate deleteMany
   */
  export type RatingUpdateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RatingUpdates to delete
     */
    where?: RatingUpdateWhereInput
    /**
     * Limit how many RatingUpdates to delete.
     */
    limit?: number
  }

  /**
   * RatingUpdate without action
   */
  export type RatingUpdateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RatingUpdate
     */
    select?: RatingUpdateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RatingUpdate
     */
    omit?: RatingUpdateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RatingUpdateInclude<ExtArgs> | null
  }


  /**
   * Model AdminAction
   */

  export type AggregateAdminAction = {
    _count: AdminActionCountAggregateOutputType | null
    _min: AdminActionMinAggregateOutputType | null
    _max: AdminActionMaxAggregateOutputType | null
  }

  export type AdminActionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    targetId: string | null
    details: string | null
    createdAt: Date | null
  }

  export type AdminActionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    action: string | null
    targetId: string | null
    details: string | null
    createdAt: Date | null
  }

  export type AdminActionCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    targetId: number
    details: number
    createdAt: number
    _all: number
  }


  export type AdminActionMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    targetId?: true
    details?: true
    createdAt?: true
  }

  export type AdminActionMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    targetId?: true
    details?: true
    createdAt?: true
  }

  export type AdminActionCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    targetId?: true
    details?: true
    createdAt?: true
    _all?: true
  }

  export type AdminActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminAction to aggregate.
     */
    where?: AdminActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActions to fetch.
     */
    orderBy?: AdminActionOrderByWithRelationInput | AdminActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AdminActions
    **/
    _count?: true | AdminActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminActionMaxAggregateInputType
  }

  export type GetAdminActionAggregateType<T extends AdminActionAggregateArgs> = {
        [P in keyof T & keyof AggregateAdminAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdminAction[P]>
      : GetScalarType<T[P], AggregateAdminAction[P]>
  }




  export type AdminActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminActionWhereInput
    orderBy?: AdminActionOrderByWithAggregationInput | AdminActionOrderByWithAggregationInput[]
    by: AdminActionScalarFieldEnum[] | AdminActionScalarFieldEnum
    having?: AdminActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminActionCountAggregateInputType | true
    _min?: AdminActionMinAggregateInputType
    _max?: AdminActionMaxAggregateInputType
  }

  export type AdminActionGroupByOutputType = {
    id: string
    userId: string | null
    action: string
    targetId: string | null
    details: string | null
    createdAt: Date
    _count: AdminActionCountAggregateOutputType | null
    _min: AdminActionMinAggregateOutputType | null
    _max: AdminActionMaxAggregateOutputType | null
  }

  type GetAdminActionGroupByPayload<T extends AdminActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminActionGroupByOutputType[P]>
            : GetScalarType<T[P], AdminActionGroupByOutputType[P]>
        }
      >
    >


  export type AdminActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
    createdAt?: boolean
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }, ExtArgs["result"]["adminAction"]>

  export type AdminActionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
    createdAt?: boolean
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }, ExtArgs["result"]["adminAction"]>

  export type AdminActionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
    createdAt?: boolean
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }, ExtArgs["result"]["adminAction"]>

  export type AdminActionSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    targetId?: boolean
    details?: boolean
    createdAt?: boolean
  }

  export type AdminActionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "targetId" | "details" | "createdAt", ExtArgs["result"]["adminAction"]>
  export type AdminActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }
  export type AdminActionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }
  export type AdminActionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AdminAction$userArgs<ExtArgs>
  }

  export type $AdminActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AdminAction"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      action: string
      targetId: string | null
      details: string | null
      createdAt: Date
    }, ExtArgs["result"]["adminAction"]>
    composites: {}
  }

  type AdminActionGetPayload<S extends boolean | null | undefined | AdminActionDefaultArgs> = $Result.GetResult<Prisma.$AdminActionPayload, S>

  type AdminActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminActionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminActionCountAggregateInputType | true
    }

  export interface AdminActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AdminAction'], meta: { name: 'AdminAction' } }
    /**
     * Find zero or one AdminAction that matches the filter.
     * @param {AdminActionFindUniqueArgs} args - Arguments to find a AdminAction
     * @example
     * // Get one AdminAction
     * const adminAction = await prisma.adminAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminActionFindUniqueArgs>(args: SelectSubset<T, AdminActionFindUniqueArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AdminAction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminActionFindUniqueOrThrowArgs} args - Arguments to find a AdminAction
     * @example
     * // Get one AdminAction
     * const adminAction = await prisma.adminAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminActionFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionFindFirstArgs} args - Arguments to find a AdminAction
     * @example
     * // Get one AdminAction
     * const adminAction = await prisma.adminAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminActionFindFirstArgs>(args?: SelectSubset<T, AdminActionFindFirstArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AdminAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionFindFirstOrThrowArgs} args - Arguments to find a AdminAction
     * @example
     * // Get one AdminAction
     * const adminAction = await prisma.adminAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminActionFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AdminActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AdminActions
     * const adminActions = await prisma.adminAction.findMany()
     * 
     * // Get first 10 AdminActions
     * const adminActions = await prisma.adminAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminActionWithIdOnly = await prisma.adminAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminActionFindManyArgs>(args?: SelectSubset<T, AdminActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AdminAction.
     * @param {AdminActionCreateArgs} args - Arguments to create a AdminAction.
     * @example
     * // Create one AdminAction
     * const AdminAction = await prisma.adminAction.create({
     *   data: {
     *     // ... data to create a AdminAction
     *   }
     * })
     * 
     */
    create<T extends AdminActionCreateArgs>(args: SelectSubset<T, AdminActionCreateArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AdminActions.
     * @param {AdminActionCreateManyArgs} args - Arguments to create many AdminActions.
     * @example
     * // Create many AdminActions
     * const adminAction = await prisma.adminAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminActionCreateManyArgs>(args?: SelectSubset<T, AdminActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AdminActions and returns the data saved in the database.
     * @param {AdminActionCreateManyAndReturnArgs} args - Arguments to create many AdminActions.
     * @example
     * // Create many AdminActions
     * const adminAction = await prisma.adminAction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AdminActions and only return the `id`
     * const adminActionWithIdOnly = await prisma.adminAction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminActionCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminActionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AdminAction.
     * @param {AdminActionDeleteArgs} args - Arguments to delete one AdminAction.
     * @example
     * // Delete one AdminAction
     * const AdminAction = await prisma.adminAction.delete({
     *   where: {
     *     // ... filter to delete one AdminAction
     *   }
     * })
     * 
     */
    delete<T extends AdminActionDeleteArgs>(args: SelectSubset<T, AdminActionDeleteArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AdminAction.
     * @param {AdminActionUpdateArgs} args - Arguments to update one AdminAction.
     * @example
     * // Update one AdminAction
     * const adminAction = await prisma.adminAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminActionUpdateArgs>(args: SelectSubset<T, AdminActionUpdateArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AdminActions.
     * @param {AdminActionDeleteManyArgs} args - Arguments to filter AdminActions to delete.
     * @example
     * // Delete a few AdminActions
     * const { count } = await prisma.adminAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminActionDeleteManyArgs>(args?: SelectSubset<T, AdminActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AdminActions
     * const adminAction = await prisma.adminAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminActionUpdateManyArgs>(args: SelectSubset<T, AdminActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AdminActions and returns the data updated in the database.
     * @param {AdminActionUpdateManyAndReturnArgs} args - Arguments to update many AdminActions.
     * @example
     * // Update many AdminActions
     * const adminAction = await prisma.adminAction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AdminActions and only return the `id`
     * const adminActionWithIdOnly = await prisma.adminAction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminActionUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminActionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AdminAction.
     * @param {AdminActionUpsertArgs} args - Arguments to update or create a AdminAction.
     * @example
     * // Update or create a AdminAction
     * const adminAction = await prisma.adminAction.upsert({
     *   create: {
     *     // ... data to create a AdminAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AdminAction we want to update
     *   }
     * })
     */
    upsert<T extends AdminActionUpsertArgs>(args: SelectSubset<T, AdminActionUpsertArgs<ExtArgs>>): Prisma__AdminActionClient<$Result.GetResult<Prisma.$AdminActionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AdminActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionCountArgs} args - Arguments to filter AdminActions to count.
     * @example
     * // Count the number of AdminActions
     * const count = await prisma.adminAction.count({
     *   where: {
     *     // ... the filter for the AdminActions we want to count
     *   }
     * })
    **/
    count<T extends AdminActionCountArgs>(
      args?: Subset<T, AdminActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AdminAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminActionAggregateArgs>(args: Subset<T, AdminActionAggregateArgs>): Prisma.PrismaPromise<GetAdminActionAggregateType<T>>

    /**
     * Group by AdminAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminActionGroupByArgs['orderBy'] }
        : { orderBy?: AdminActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AdminAction model
   */
  readonly fields: AdminActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AdminAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AdminAction$userArgs<ExtArgs> = {}>(args?: Subset<T, AdminAction$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AdminAction model
   */
  interface AdminActionFieldRefs {
    readonly id: FieldRef<"AdminAction", 'String'>
    readonly userId: FieldRef<"AdminAction", 'String'>
    readonly action: FieldRef<"AdminAction", 'String'>
    readonly targetId: FieldRef<"AdminAction", 'String'>
    readonly details: FieldRef<"AdminAction", 'String'>
    readonly createdAt: FieldRef<"AdminAction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AdminAction findUnique
   */
  export type AdminActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter, which AdminAction to fetch.
     */
    where: AdminActionWhereUniqueInput
  }

  /**
   * AdminAction findUniqueOrThrow
   */
  export type AdminActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter, which AdminAction to fetch.
     */
    where: AdminActionWhereUniqueInput
  }

  /**
   * AdminAction findFirst
   */
  export type AdminActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter, which AdminAction to fetch.
     */
    where?: AdminActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActions to fetch.
     */
    orderBy?: AdminActionOrderByWithRelationInput | AdminActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminActions.
     */
    cursor?: AdminActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminActions.
     */
    distinct?: AdminActionScalarFieldEnum | AdminActionScalarFieldEnum[]
  }

  /**
   * AdminAction findFirstOrThrow
   */
  export type AdminActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter, which AdminAction to fetch.
     */
    where?: AdminActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActions to fetch.
     */
    orderBy?: AdminActionOrderByWithRelationInput | AdminActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AdminActions.
     */
    cursor?: AdminActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AdminActions.
     */
    distinct?: AdminActionScalarFieldEnum | AdminActionScalarFieldEnum[]
  }

  /**
   * AdminAction findMany
   */
  export type AdminActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter, which AdminActions to fetch.
     */
    where?: AdminActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AdminActions to fetch.
     */
    orderBy?: AdminActionOrderByWithRelationInput | AdminActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AdminActions.
     */
    cursor?: AdminActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AdminActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AdminActions.
     */
    skip?: number
    distinct?: AdminActionScalarFieldEnum | AdminActionScalarFieldEnum[]
  }

  /**
   * AdminAction create
   */
  export type AdminActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * The data needed to create a AdminAction.
     */
    data: XOR<AdminActionCreateInput, AdminActionUncheckedCreateInput>
  }

  /**
   * AdminAction createMany
   */
  export type AdminActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AdminActions.
     */
    data: AdminActionCreateManyInput | AdminActionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AdminAction createManyAndReturn
   */
  export type AdminActionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * The data used to create many AdminActions.
     */
    data: AdminActionCreateManyInput | AdminActionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AdminAction update
   */
  export type AdminActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * The data needed to update a AdminAction.
     */
    data: XOR<AdminActionUpdateInput, AdminActionUncheckedUpdateInput>
    /**
     * Choose, which AdminAction to update.
     */
    where: AdminActionWhereUniqueInput
  }

  /**
   * AdminAction updateMany
   */
  export type AdminActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AdminActions.
     */
    data: XOR<AdminActionUpdateManyMutationInput, AdminActionUncheckedUpdateManyInput>
    /**
     * Filter which AdminActions to update
     */
    where?: AdminActionWhereInput
    /**
     * Limit how many AdminActions to update.
     */
    limit?: number
  }

  /**
   * AdminAction updateManyAndReturn
   */
  export type AdminActionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * The data used to update AdminActions.
     */
    data: XOR<AdminActionUpdateManyMutationInput, AdminActionUncheckedUpdateManyInput>
    /**
     * Filter which AdminActions to update
     */
    where?: AdminActionWhereInput
    /**
     * Limit how many AdminActions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AdminAction upsert
   */
  export type AdminActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * The filter to search for the AdminAction to update in case it exists.
     */
    where: AdminActionWhereUniqueInput
    /**
     * In case the AdminAction found by the `where` argument doesn't exist, create a new AdminAction with this data.
     */
    create: XOR<AdminActionCreateInput, AdminActionUncheckedCreateInput>
    /**
     * In case the AdminAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminActionUpdateInput, AdminActionUncheckedUpdateInput>
  }

  /**
   * AdminAction delete
   */
  export type AdminActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
    /**
     * Filter which AdminAction to delete.
     */
    where: AdminActionWhereUniqueInput
  }

  /**
   * AdminAction deleteMany
   */
  export type AdminActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AdminActions to delete
     */
    where?: AdminActionWhereInput
    /**
     * Limit how many AdminActions to delete.
     */
    limit?: number
  }

  /**
   * AdminAction.user
   */
  export type AdminAction$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AdminAction without action
   */
  export type AdminActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AdminAction
     */
    select?: AdminActionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AdminAction
     */
    omit?: AdminActionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AdminActionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image',
    isAdmin: 'isAdmin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    expiresAt: 'expiresAt',
    tokenType: 'tokenType',
    scope: 'scope',
    idToken: 'idToken',
    sessionState: 'sessionState'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const PlayerScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    email: 'email',
    avatar: 'avatar',
    createdAt: 'createdAt'
  };

  export type PlayerScalarFieldEnum = (typeof PlayerScalarFieldEnum)[keyof typeof PlayerScalarFieldEnum]


  export const LeagueScalarFieldEnum: {
    id: 'id',
    name: 'name',
    gameType: 'gameType',
    createdAt: 'createdAt'
  };

  export type LeagueScalarFieldEnum = (typeof LeagueScalarFieldEnum)[keyof typeof LeagueScalarFieldEnum]


  export const LeagueMembershipScalarFieldEnum: {
    id: 'id',
    playerId: 'playerId',
    leagueId: 'leagueId',
    joinedAt: 'joinedAt',
    isActive: 'isActive'
  };

  export type LeagueMembershipScalarFieldEnum = (typeof LeagueMembershipScalarFieldEnum)[keyof typeof LeagueMembershipScalarFieldEnum]


  export const PlayerRatingScalarFieldEnum: {
    id: 'id',
    playerId: 'playerId',
    leagueId: 'leagueId',
    rating: 'rating',
    gamesPlayed: 'gamesPlayed',
    wins: 'wins',
    losses: 'losses',
    draws: 'draws',
    updatedAt: 'updatedAt'
  };

  export type PlayerRatingScalarFieldEnum = (typeof PlayerRatingScalarFieldEnum)[keyof typeof PlayerRatingScalarFieldEnum]


  export const ChallengeScalarFieldEnum: {
    id: 'id',
    challengerId: 'challengerId',
    challengeeId: 'challengeeId',
    leagueId: 'leagueId',
    status: 'status',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt'
  };

  export type ChallengeScalarFieldEnum = (typeof ChallengeScalarFieldEnum)[keyof typeof ChallengeScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    challengeId: 'challengeId',
    player1Id: 'player1Id',
    player2Id: 'player2Id',
    leagueId: 'leagueId',
    player1Score: 'player1Score',
    player2Score: 'player2Score',
    winnerId: 'winnerId',
    status: 'status',
    reportedBy: 'reportedBy',
    playedAt: 'playedAt',
    confirmedAt: 'confirmedAt'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const MatchConfirmationScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    playerId: 'playerId',
    action: 'action',
    confirmedScore1: 'confirmedScore1',
    confirmedScore2: 'confirmedScore2',
    disputeReason: 'disputeReason',
    createdAt: 'createdAt'
  };

  export type MatchConfirmationScalarFieldEnum = (typeof MatchConfirmationScalarFieldEnum)[keyof typeof MatchConfirmationScalarFieldEnum]


  export const RatingUpdateScalarFieldEnum: {
    id: 'id',
    matchId: 'matchId',
    playerId: 'playerId',
    leagueId: 'leagueId',
    oldRating: 'oldRating',
    newRating: 'newRating',
    change: 'change',
    createdAt: 'createdAt'
  };

  export type RatingUpdateScalarFieldEnum = (typeof RatingUpdateScalarFieldEnum)[keyof typeof RatingUpdateScalarFieldEnum]


  export const AdminActionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    targetId: 'targetId',
    details: 'details',
    createdAt: 'createdAt'
  };

  export type AdminActionScalarFieldEnum = (typeof AdminActionScalarFieldEnum)[keyof typeof AdminActionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringFilter<"User"> | string
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    players?: PlayerListRelationFilter
    adminActions?: AdminActionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    players?: PlayerOrderByRelationAggregateInput
    adminActions?: AdminActionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    isAdmin?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    players?: PlayerListRelationFilter
    adminActions?: AdminActionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringWithAggregatesFilter<"User"> | string
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    isAdmin?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    tokenType?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    sessionState?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    tokenType?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    sessionState?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expiresAt?: IntNullableWithAggregatesFilter<"Account"> | number | null
    tokenType?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    sessionState?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type PlayerWhereInput = {
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    id?: StringFilter<"Player"> | string
    userId?: StringFilter<"Player"> | string
    name?: StringFilter<"Player"> | string
    email?: StringNullableFilter<"Player"> | string | null
    avatar?: StringNullableFilter<"Player"> | string | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    memberships?: LeagueMembershipListRelationFilter
    ratings?: PlayerRatingListRelationFilter
    challengesSent?: ChallengeListRelationFilter
    challengesReceived?: ChallengeListRelationFilter
    matchesAsPlayer1?: MatchListRelationFilter
    matchesAsPlayer2?: MatchListRelationFilter
    matchesWon?: MatchListRelationFilter
    matchesReported?: MatchListRelationFilter
    matchConfirmations?: MatchConfirmationListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }

  export type PlayerOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    memberships?: LeagueMembershipOrderByRelationAggregateInput
    ratings?: PlayerRatingOrderByRelationAggregateInput
    challengesSent?: ChallengeOrderByRelationAggregateInput
    challengesReceived?: ChallengeOrderByRelationAggregateInput
    matchesAsPlayer1?: MatchOrderByRelationAggregateInput
    matchesAsPlayer2?: MatchOrderByRelationAggregateInput
    matchesWon?: MatchOrderByRelationAggregateInput
    matchesReported?: MatchOrderByRelationAggregateInput
    matchConfirmations?: MatchConfirmationOrderByRelationAggregateInput
    ratingUpdates?: RatingUpdateOrderByRelationAggregateInput
  }

  export type PlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    userId_name?: PlayerUserIdNameCompoundUniqueInput
    AND?: PlayerWhereInput | PlayerWhereInput[]
    OR?: PlayerWhereInput[]
    NOT?: PlayerWhereInput | PlayerWhereInput[]
    userId?: StringFilter<"Player"> | string
    name?: StringFilter<"Player"> | string
    avatar?: StringNullableFilter<"Player"> | string | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    memberships?: LeagueMembershipListRelationFilter
    ratings?: PlayerRatingListRelationFilter
    challengesSent?: ChallengeListRelationFilter
    challengesReceived?: ChallengeListRelationFilter
    matchesAsPlayer1?: MatchListRelationFilter
    matchesAsPlayer2?: MatchListRelationFilter
    matchesWon?: MatchListRelationFilter
    matchesReported?: MatchListRelationFilter
    matchConfirmations?: MatchConfirmationListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }, "id" | "email" | "userId_name">

  export type PlayerOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PlayerCountOrderByAggregateInput
    _max?: PlayerMaxOrderByAggregateInput
    _min?: PlayerMinOrderByAggregateInput
  }

  export type PlayerScalarWhereWithAggregatesInput = {
    AND?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    OR?: PlayerScalarWhereWithAggregatesInput[]
    NOT?: PlayerScalarWhereWithAggregatesInput | PlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Player"> | string
    userId?: StringWithAggregatesFilter<"Player"> | string
    name?: StringWithAggregatesFilter<"Player"> | string
    email?: StringNullableWithAggregatesFilter<"Player"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"Player"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Player"> | Date | string
  }

  export type LeagueWhereInput = {
    AND?: LeagueWhereInput | LeagueWhereInput[]
    OR?: LeagueWhereInput[]
    NOT?: LeagueWhereInput | LeagueWhereInput[]
    id?: StringFilter<"League"> | string
    name?: StringFilter<"League"> | string
    gameType?: StringFilter<"League"> | string
    createdAt?: DateTimeFilter<"League"> | Date | string
    memberships?: LeagueMembershipListRelationFilter
    ratings?: PlayerRatingListRelationFilter
    challenges?: ChallengeListRelationFilter
    matches?: MatchListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }

  export type LeagueOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gameType?: SortOrder
    createdAt?: SortOrder
    memberships?: LeagueMembershipOrderByRelationAggregateInput
    ratings?: PlayerRatingOrderByRelationAggregateInput
    challenges?: ChallengeOrderByRelationAggregateInput
    matches?: MatchOrderByRelationAggregateInput
    ratingUpdates?: RatingUpdateOrderByRelationAggregateInput
  }

  export type LeagueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: LeagueWhereInput | LeagueWhereInput[]
    OR?: LeagueWhereInput[]
    NOT?: LeagueWhereInput | LeagueWhereInput[]
    gameType?: StringFilter<"League"> | string
    createdAt?: DateTimeFilter<"League"> | Date | string
    memberships?: LeagueMembershipListRelationFilter
    ratings?: PlayerRatingListRelationFilter
    challenges?: ChallengeListRelationFilter
    matches?: MatchListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }, "id" | "name">

  export type LeagueOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    gameType?: SortOrder
    createdAt?: SortOrder
    _count?: LeagueCountOrderByAggregateInput
    _max?: LeagueMaxOrderByAggregateInput
    _min?: LeagueMinOrderByAggregateInput
  }

  export type LeagueScalarWhereWithAggregatesInput = {
    AND?: LeagueScalarWhereWithAggregatesInput | LeagueScalarWhereWithAggregatesInput[]
    OR?: LeagueScalarWhereWithAggregatesInput[]
    NOT?: LeagueScalarWhereWithAggregatesInput | LeagueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"League"> | string
    name?: StringWithAggregatesFilter<"League"> | string
    gameType?: StringWithAggregatesFilter<"League"> | string
    createdAt?: DateTimeWithAggregatesFilter<"League"> | Date | string
  }

  export type LeagueMembershipWhereInput = {
    AND?: LeagueMembershipWhereInput | LeagueMembershipWhereInput[]
    OR?: LeagueMembershipWhereInput[]
    NOT?: LeagueMembershipWhereInput | LeagueMembershipWhereInput[]
    id?: StringFilter<"LeagueMembership"> | string
    playerId?: StringFilter<"LeagueMembership"> | string
    leagueId?: StringFilter<"LeagueMembership"> | string
    joinedAt?: DateTimeFilter<"LeagueMembership"> | Date | string
    isActive?: BoolFilter<"LeagueMembership"> | boolean
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }

  export type LeagueMembershipOrderByWithRelationInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    joinedAt?: SortOrder
    isActive?: SortOrder
    player?: PlayerOrderByWithRelationInput
    league?: LeagueOrderByWithRelationInput
  }

  export type LeagueMembershipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    playerId_leagueId?: LeagueMembershipPlayerIdLeagueIdCompoundUniqueInput
    AND?: LeagueMembershipWhereInput | LeagueMembershipWhereInput[]
    OR?: LeagueMembershipWhereInput[]
    NOT?: LeagueMembershipWhereInput | LeagueMembershipWhereInput[]
    playerId?: StringFilter<"LeagueMembership"> | string
    leagueId?: StringFilter<"LeagueMembership"> | string
    joinedAt?: DateTimeFilter<"LeagueMembership"> | Date | string
    isActive?: BoolFilter<"LeagueMembership"> | boolean
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }, "id" | "playerId_leagueId">

  export type LeagueMembershipOrderByWithAggregationInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    joinedAt?: SortOrder
    isActive?: SortOrder
    _count?: LeagueMembershipCountOrderByAggregateInput
    _max?: LeagueMembershipMaxOrderByAggregateInput
    _min?: LeagueMembershipMinOrderByAggregateInput
  }

  export type LeagueMembershipScalarWhereWithAggregatesInput = {
    AND?: LeagueMembershipScalarWhereWithAggregatesInput | LeagueMembershipScalarWhereWithAggregatesInput[]
    OR?: LeagueMembershipScalarWhereWithAggregatesInput[]
    NOT?: LeagueMembershipScalarWhereWithAggregatesInput | LeagueMembershipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeagueMembership"> | string
    playerId?: StringWithAggregatesFilter<"LeagueMembership"> | string
    leagueId?: StringWithAggregatesFilter<"LeagueMembership"> | string
    joinedAt?: DateTimeWithAggregatesFilter<"LeagueMembership"> | Date | string
    isActive?: BoolWithAggregatesFilter<"LeagueMembership"> | boolean
  }

  export type PlayerRatingWhereInput = {
    AND?: PlayerRatingWhereInput | PlayerRatingWhereInput[]
    OR?: PlayerRatingWhereInput[]
    NOT?: PlayerRatingWhereInput | PlayerRatingWhereInput[]
    id?: StringFilter<"PlayerRating"> | string
    playerId?: StringFilter<"PlayerRating"> | string
    leagueId?: StringFilter<"PlayerRating"> | string
    rating?: IntFilter<"PlayerRating"> | number
    gamesPlayed?: IntFilter<"PlayerRating"> | number
    wins?: IntFilter<"PlayerRating"> | number
    losses?: IntFilter<"PlayerRating"> | number
    draws?: IntFilter<"PlayerRating"> | number
    updatedAt?: DateTimeFilter<"PlayerRating"> | Date | string
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }

  export type PlayerRatingOrderByWithRelationInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    updatedAt?: SortOrder
    player?: PlayerOrderByWithRelationInput
    league?: LeagueOrderByWithRelationInput
  }

  export type PlayerRatingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    playerId_leagueId?: PlayerRatingPlayerIdLeagueIdCompoundUniqueInput
    AND?: PlayerRatingWhereInput | PlayerRatingWhereInput[]
    OR?: PlayerRatingWhereInput[]
    NOT?: PlayerRatingWhereInput | PlayerRatingWhereInput[]
    playerId?: StringFilter<"PlayerRating"> | string
    leagueId?: StringFilter<"PlayerRating"> | string
    rating?: IntFilter<"PlayerRating"> | number
    gamesPlayed?: IntFilter<"PlayerRating"> | number
    wins?: IntFilter<"PlayerRating"> | number
    losses?: IntFilter<"PlayerRating"> | number
    draws?: IntFilter<"PlayerRating"> | number
    updatedAt?: DateTimeFilter<"PlayerRating"> | Date | string
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }, "id" | "playerId_leagueId">

  export type PlayerRatingOrderByWithAggregationInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    updatedAt?: SortOrder
    _count?: PlayerRatingCountOrderByAggregateInput
    _avg?: PlayerRatingAvgOrderByAggregateInput
    _max?: PlayerRatingMaxOrderByAggregateInput
    _min?: PlayerRatingMinOrderByAggregateInput
    _sum?: PlayerRatingSumOrderByAggregateInput
  }

  export type PlayerRatingScalarWhereWithAggregatesInput = {
    AND?: PlayerRatingScalarWhereWithAggregatesInput | PlayerRatingScalarWhereWithAggregatesInput[]
    OR?: PlayerRatingScalarWhereWithAggregatesInput[]
    NOT?: PlayerRatingScalarWhereWithAggregatesInput | PlayerRatingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PlayerRating"> | string
    playerId?: StringWithAggregatesFilter<"PlayerRating"> | string
    leagueId?: StringWithAggregatesFilter<"PlayerRating"> | string
    rating?: IntWithAggregatesFilter<"PlayerRating"> | number
    gamesPlayed?: IntWithAggregatesFilter<"PlayerRating"> | number
    wins?: IntWithAggregatesFilter<"PlayerRating"> | number
    losses?: IntWithAggregatesFilter<"PlayerRating"> | number
    draws?: IntWithAggregatesFilter<"PlayerRating"> | number
    updatedAt?: DateTimeWithAggregatesFilter<"PlayerRating"> | Date | string
  }

  export type ChallengeWhereInput = {
    AND?: ChallengeWhereInput | ChallengeWhereInput[]
    OR?: ChallengeWhereInput[]
    NOT?: ChallengeWhereInput | ChallengeWhereInput[]
    id?: StringFilter<"Challenge"> | string
    challengerId?: StringFilter<"Challenge"> | string
    challengeeId?: StringFilter<"Challenge"> | string
    leagueId?: StringFilter<"Challenge"> | string
    status?: StringFilter<"Challenge"> | string
    createdAt?: DateTimeFilter<"Challenge"> | Date | string
    expiresAt?: DateTimeNullableFilter<"Challenge"> | Date | string | null
    challenger?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    challengee?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
    match?: XOR<MatchNullableScalarRelationFilter, MatchWhereInput> | null
  }

  export type ChallengeOrderByWithRelationInput = {
    id?: SortOrder
    challengerId?: SortOrder
    challengeeId?: SortOrder
    leagueId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    challenger?: PlayerOrderByWithRelationInput
    challengee?: PlayerOrderByWithRelationInput
    league?: LeagueOrderByWithRelationInput
    match?: MatchOrderByWithRelationInput
  }

  export type ChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChallengeWhereInput | ChallengeWhereInput[]
    OR?: ChallengeWhereInput[]
    NOT?: ChallengeWhereInput | ChallengeWhereInput[]
    challengerId?: StringFilter<"Challenge"> | string
    challengeeId?: StringFilter<"Challenge"> | string
    leagueId?: StringFilter<"Challenge"> | string
    status?: StringFilter<"Challenge"> | string
    createdAt?: DateTimeFilter<"Challenge"> | Date | string
    expiresAt?: DateTimeNullableFilter<"Challenge"> | Date | string | null
    challenger?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    challengee?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
    match?: XOR<MatchNullableScalarRelationFilter, MatchWhereInput> | null
  }, "id">

  export type ChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    challengerId?: SortOrder
    challengeeId?: SortOrder
    leagueId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    _count?: ChallengeCountOrderByAggregateInput
    _max?: ChallengeMaxOrderByAggregateInput
    _min?: ChallengeMinOrderByAggregateInput
  }

  export type ChallengeScalarWhereWithAggregatesInput = {
    AND?: ChallengeScalarWhereWithAggregatesInput | ChallengeScalarWhereWithAggregatesInput[]
    OR?: ChallengeScalarWhereWithAggregatesInput[]
    NOT?: ChallengeScalarWhereWithAggregatesInput | ChallengeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Challenge"> | string
    challengerId?: StringWithAggregatesFilter<"Challenge"> | string
    challengeeId?: StringWithAggregatesFilter<"Challenge"> | string
    leagueId?: StringWithAggregatesFilter<"Challenge"> | string
    status?: StringWithAggregatesFilter<"Challenge"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Challenge"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Challenge"> | Date | string | null
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    challengeId?: StringNullableFilter<"Match"> | string | null
    player1Id?: StringFilter<"Match"> | string
    player2Id?: StringFilter<"Match"> | string
    leagueId?: StringFilter<"Match"> | string
    player1Score?: IntFilter<"Match"> | number
    player2Score?: IntFilter<"Match"> | number
    winnerId?: StringNullableFilter<"Match"> | string | null
    status?: StringFilter<"Match"> | string
    reportedBy?: StringNullableFilter<"Match"> | string | null
    playedAt?: DateTimeFilter<"Match"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    challenge?: XOR<ChallengeNullableScalarRelationFilter, ChallengeWhereInput> | null
    player1?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    player2?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    winner?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
    reporter?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
    confirmations?: MatchConfirmationListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    challengeId?: SortOrderInput | SortOrder
    player1Id?: SortOrder
    player2Id?: SortOrder
    leagueId?: SortOrder
    player1Score?: SortOrder
    player2Score?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    status?: SortOrder
    reportedBy?: SortOrderInput | SortOrder
    playedAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    challenge?: ChallengeOrderByWithRelationInput
    player1?: PlayerOrderByWithRelationInput
    player2?: PlayerOrderByWithRelationInput
    winner?: PlayerOrderByWithRelationInput
    reporter?: PlayerOrderByWithRelationInput
    league?: LeagueOrderByWithRelationInput
    confirmations?: MatchConfirmationOrderByRelationAggregateInput
    ratingUpdates?: RatingUpdateOrderByRelationAggregateInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    challengeId?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    player1Id?: StringFilter<"Match"> | string
    player2Id?: StringFilter<"Match"> | string
    leagueId?: StringFilter<"Match"> | string
    player1Score?: IntFilter<"Match"> | number
    player2Score?: IntFilter<"Match"> | number
    winnerId?: StringNullableFilter<"Match"> | string | null
    status?: StringFilter<"Match"> | string
    reportedBy?: StringNullableFilter<"Match"> | string | null
    playedAt?: DateTimeFilter<"Match"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
    challenge?: XOR<ChallengeNullableScalarRelationFilter, ChallengeWhereInput> | null
    player1?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    player2?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    winner?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
    reporter?: XOR<PlayerNullableScalarRelationFilter, PlayerWhereInput> | null
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
    confirmations?: MatchConfirmationListRelationFilter
    ratingUpdates?: RatingUpdateListRelationFilter
  }, "id" | "challengeId">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    challengeId?: SortOrderInput | SortOrder
    player1Id?: SortOrder
    player2Id?: SortOrder
    leagueId?: SortOrder
    player1Score?: SortOrder
    player2Score?: SortOrder
    winnerId?: SortOrderInput | SortOrder
    status?: SortOrder
    reportedBy?: SortOrderInput | SortOrder
    playedAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    challengeId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    player1Id?: StringWithAggregatesFilter<"Match"> | string
    player2Id?: StringWithAggregatesFilter<"Match"> | string
    leagueId?: StringWithAggregatesFilter<"Match"> | string
    player1Score?: IntWithAggregatesFilter<"Match"> | number
    player2Score?: IntWithAggregatesFilter<"Match"> | number
    winnerId?: StringNullableWithAggregatesFilter<"Match"> | string | null
    status?: StringWithAggregatesFilter<"Match"> | string
    reportedBy?: StringNullableWithAggregatesFilter<"Match"> | string | null
    playedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"Match"> | Date | string | null
  }

  export type MatchConfirmationWhereInput = {
    AND?: MatchConfirmationWhereInput | MatchConfirmationWhereInput[]
    OR?: MatchConfirmationWhereInput[]
    NOT?: MatchConfirmationWhereInput | MatchConfirmationWhereInput[]
    id?: StringFilter<"MatchConfirmation"> | string
    matchId?: StringFilter<"MatchConfirmation"> | string
    playerId?: StringFilter<"MatchConfirmation"> | string
    action?: StringFilter<"MatchConfirmation"> | string
    confirmedScore1?: IntNullableFilter<"MatchConfirmation"> | number | null
    confirmedScore2?: IntNullableFilter<"MatchConfirmation"> | number | null
    disputeReason?: StringNullableFilter<"MatchConfirmation"> | string | null
    createdAt?: DateTimeFilter<"MatchConfirmation"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }

  export type MatchConfirmationOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    action?: SortOrder
    confirmedScore1?: SortOrderInput | SortOrder
    confirmedScore2?: SortOrderInput | SortOrder
    disputeReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    match?: MatchOrderByWithRelationInput
    player?: PlayerOrderByWithRelationInput
  }

  export type MatchConfirmationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    matchId_playerId?: MatchConfirmationMatchIdPlayerIdCompoundUniqueInput
    AND?: MatchConfirmationWhereInput | MatchConfirmationWhereInput[]
    OR?: MatchConfirmationWhereInput[]
    NOT?: MatchConfirmationWhereInput | MatchConfirmationWhereInput[]
    matchId?: StringFilter<"MatchConfirmation"> | string
    playerId?: StringFilter<"MatchConfirmation"> | string
    action?: StringFilter<"MatchConfirmation"> | string
    confirmedScore1?: IntNullableFilter<"MatchConfirmation"> | number | null
    confirmedScore2?: IntNullableFilter<"MatchConfirmation"> | number | null
    disputeReason?: StringNullableFilter<"MatchConfirmation"> | string | null
    createdAt?: DateTimeFilter<"MatchConfirmation"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
  }, "id" | "matchId_playerId">

  export type MatchConfirmationOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    action?: SortOrder
    confirmedScore1?: SortOrderInput | SortOrder
    confirmedScore2?: SortOrderInput | SortOrder
    disputeReason?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MatchConfirmationCountOrderByAggregateInput
    _avg?: MatchConfirmationAvgOrderByAggregateInput
    _max?: MatchConfirmationMaxOrderByAggregateInput
    _min?: MatchConfirmationMinOrderByAggregateInput
    _sum?: MatchConfirmationSumOrderByAggregateInput
  }

  export type MatchConfirmationScalarWhereWithAggregatesInput = {
    AND?: MatchConfirmationScalarWhereWithAggregatesInput | MatchConfirmationScalarWhereWithAggregatesInput[]
    OR?: MatchConfirmationScalarWhereWithAggregatesInput[]
    NOT?: MatchConfirmationScalarWhereWithAggregatesInput | MatchConfirmationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MatchConfirmation"> | string
    matchId?: StringWithAggregatesFilter<"MatchConfirmation"> | string
    playerId?: StringWithAggregatesFilter<"MatchConfirmation"> | string
    action?: StringWithAggregatesFilter<"MatchConfirmation"> | string
    confirmedScore1?: IntNullableWithAggregatesFilter<"MatchConfirmation"> | number | null
    confirmedScore2?: IntNullableWithAggregatesFilter<"MatchConfirmation"> | number | null
    disputeReason?: StringNullableWithAggregatesFilter<"MatchConfirmation"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MatchConfirmation"> | Date | string
  }

  export type RatingUpdateWhereInput = {
    AND?: RatingUpdateWhereInput | RatingUpdateWhereInput[]
    OR?: RatingUpdateWhereInput[]
    NOT?: RatingUpdateWhereInput | RatingUpdateWhereInput[]
    id?: StringFilter<"RatingUpdate"> | string
    matchId?: StringFilter<"RatingUpdate"> | string
    playerId?: StringFilter<"RatingUpdate"> | string
    leagueId?: StringFilter<"RatingUpdate"> | string
    oldRating?: IntFilter<"RatingUpdate"> | number
    newRating?: IntFilter<"RatingUpdate"> | number
    change?: IntFilter<"RatingUpdate"> | number
    createdAt?: DateTimeFilter<"RatingUpdate"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }

  export type RatingUpdateOrderByWithRelationInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
    createdAt?: SortOrder
    match?: MatchOrderByWithRelationInput
    player?: PlayerOrderByWithRelationInput
    league?: LeagueOrderByWithRelationInput
  }

  export type RatingUpdateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RatingUpdateWhereInput | RatingUpdateWhereInput[]
    OR?: RatingUpdateWhereInput[]
    NOT?: RatingUpdateWhereInput | RatingUpdateWhereInput[]
    matchId?: StringFilter<"RatingUpdate"> | string
    playerId?: StringFilter<"RatingUpdate"> | string
    leagueId?: StringFilter<"RatingUpdate"> | string
    oldRating?: IntFilter<"RatingUpdate"> | number
    newRating?: IntFilter<"RatingUpdate"> | number
    change?: IntFilter<"RatingUpdate"> | number
    createdAt?: DateTimeFilter<"RatingUpdate"> | Date | string
    match?: XOR<MatchScalarRelationFilter, MatchWhereInput>
    player?: XOR<PlayerScalarRelationFilter, PlayerWhereInput>
    league?: XOR<LeagueScalarRelationFilter, LeagueWhereInput>
  }, "id">

  export type RatingUpdateOrderByWithAggregationInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
    createdAt?: SortOrder
    _count?: RatingUpdateCountOrderByAggregateInput
    _avg?: RatingUpdateAvgOrderByAggregateInput
    _max?: RatingUpdateMaxOrderByAggregateInput
    _min?: RatingUpdateMinOrderByAggregateInput
    _sum?: RatingUpdateSumOrderByAggregateInput
  }

  export type RatingUpdateScalarWhereWithAggregatesInput = {
    AND?: RatingUpdateScalarWhereWithAggregatesInput | RatingUpdateScalarWhereWithAggregatesInput[]
    OR?: RatingUpdateScalarWhereWithAggregatesInput[]
    NOT?: RatingUpdateScalarWhereWithAggregatesInput | RatingUpdateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RatingUpdate"> | string
    matchId?: StringWithAggregatesFilter<"RatingUpdate"> | string
    playerId?: StringWithAggregatesFilter<"RatingUpdate"> | string
    leagueId?: StringWithAggregatesFilter<"RatingUpdate"> | string
    oldRating?: IntWithAggregatesFilter<"RatingUpdate"> | number
    newRating?: IntWithAggregatesFilter<"RatingUpdate"> | number
    change?: IntWithAggregatesFilter<"RatingUpdate"> | number
    createdAt?: DateTimeWithAggregatesFilter<"RatingUpdate"> | Date | string
  }

  export type AdminActionWhereInput = {
    AND?: AdminActionWhereInput | AdminActionWhereInput[]
    OR?: AdminActionWhereInput[]
    NOT?: AdminActionWhereInput | AdminActionWhereInput[]
    id?: StringFilter<"AdminAction"> | string
    userId?: StringNullableFilter<"AdminAction"> | string | null
    action?: StringFilter<"AdminAction"> | string
    targetId?: StringNullableFilter<"AdminAction"> | string | null
    details?: StringNullableFilter<"AdminAction"> | string | null
    createdAt?: DateTimeFilter<"AdminAction"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AdminActionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AdminActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AdminActionWhereInput | AdminActionWhereInput[]
    OR?: AdminActionWhereInput[]
    NOT?: AdminActionWhereInput | AdminActionWhereInput[]
    userId?: StringNullableFilter<"AdminAction"> | string | null
    action?: StringFilter<"AdminAction"> | string
    targetId?: StringNullableFilter<"AdminAction"> | string | null
    details?: StringNullableFilter<"AdminAction"> | string | null
    createdAt?: DateTimeFilter<"AdminAction"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AdminActionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    targetId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AdminActionCountOrderByAggregateInput
    _max?: AdminActionMaxOrderByAggregateInput
    _min?: AdminActionMinOrderByAggregateInput
  }

  export type AdminActionScalarWhereWithAggregatesInput = {
    AND?: AdminActionScalarWhereWithAggregatesInput | AdminActionScalarWhereWithAggregatesInput[]
    OR?: AdminActionScalarWhereWithAggregatesInput[]
    NOT?: AdminActionScalarWhereWithAggregatesInput | AdminActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AdminAction"> | string
    userId?: StringNullableWithAggregatesFilter<"AdminAction"> | string | null
    action?: StringWithAggregatesFilter<"AdminAction"> | string
    targetId?: StringNullableWithAggregatesFilter<"AdminAction"> | string | null
    details?: StringNullableWithAggregatesFilter<"AdminAction"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AdminAction"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    players?: PlayerCreateNestedManyWithoutUserInput
    adminActions?: AdminActionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    adminActions?: AdminActionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerCreateInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerCreateManyInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
  }

  export type PlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeagueCreateInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeCreateNestedManyWithoutLeagueInput
    matches?: MatchCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeUncheckedCreateNestedManyWithoutLeagueInput
    matches?: MatchUncheckedCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUpdateManyWithoutLeagueNestedInput
    matches?: MatchUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUncheckedUpdateManyWithoutLeagueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueCreateManyInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
  }

  export type LeagueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeagueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeagueMembershipCreateInput = {
    id?: string
    joinedAt?: Date | string
    isActive?: boolean
    player: PlayerCreateNestedOneWithoutMembershipsInput
    league: LeagueCreateNestedOneWithoutMembershipsInput
  }

  export type LeagueMembershipUncheckedCreateInput = {
    id?: string
    playerId: string
    leagueId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type LeagueMembershipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    player?: PlayerUpdateOneRequiredWithoutMembershipsNestedInput
    league?: LeagueUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type LeagueMembershipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LeagueMembershipCreateManyInput = {
    id?: string
    playerId: string
    leagueId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type LeagueMembershipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LeagueMembershipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlayerRatingCreateInput = {
    id?: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
    player: PlayerCreateNestedOneWithoutRatingsInput
    league: LeagueCreateNestedOneWithoutRatingsInput
  }

  export type PlayerRatingUncheckedCreateInput = {
    id?: string
    playerId: string
    leagueId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type PlayerRatingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutRatingsNestedInput
    league?: LeagueUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type PlayerRatingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRatingCreateManyInput = {
    id?: string
    playerId: string
    leagueId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type PlayerRatingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRatingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeCreateInput = {
    id?: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    challenger: PlayerCreateNestedOneWithoutChallengesSentInput
    challengee: PlayerCreateNestedOneWithoutChallengesReceivedInput
    league: LeagueCreateNestedOneWithoutChallengesInput
    match?: MatchCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeUncheckedCreateInput = {
    id?: string
    challengerId: string
    challengeeId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    match?: MatchUncheckedCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenger?: PlayerUpdateOneRequiredWithoutChallengesSentNestedInput
    challengee?: PlayerUpdateOneRequiredWithoutChallengesReceivedNestedInput
    league?: LeagueUpdateOneRequiredWithoutChallengesNestedInput
    match?: MatchUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    match?: MatchUncheckedUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeCreateManyInput = {
    id?: string
    challengerId: string
    challengeeId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchCreateInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchCreateManyInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchConfirmationCreateInput = {
    id?: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutConfirmationsInput
    player: PlayerCreateNestedOneWithoutMatchConfirmationsInput
  }

  export type MatchConfirmationUncheckedCreateInput = {
    id?: string
    matchId: string
    playerId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type MatchConfirmationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutConfirmationsNestedInput
    player?: PlayerUpdateOneRequiredWithoutMatchConfirmationsNestedInput
  }

  export type MatchConfirmationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchConfirmationCreateManyInput = {
    id?: string
    matchId: string
    playerId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type MatchConfirmationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchConfirmationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateCreateInput = {
    id?: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutRatingUpdatesInput
    player: PlayerCreateNestedOneWithoutRatingUpdatesInput
    league: LeagueCreateNestedOneWithoutRatingUpdatesInput
  }

  export type RatingUpdateUncheckedCreateInput = {
    id?: string
    matchId: string
    playerId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type RatingUpdateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutRatingUpdatesNestedInput
    player?: PlayerUpdateOneRequiredWithoutRatingUpdatesNestedInput
    league?: LeagueUpdateOneRequiredWithoutRatingUpdatesNestedInput
  }

  export type RatingUpdateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateCreateManyInput = {
    id?: string
    matchId: string
    playerId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type RatingUpdateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionCreateInput = {
    id?: string
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAdminActionsInput
  }

  export type AdminActionUncheckedCreateInput = {
    id?: string
    userId?: string | null
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
  }

  export type AdminActionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAdminActionsNestedInput
  }

  export type AdminActionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionCreateManyInput = {
    id?: string
    userId?: string | null
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
  }

  export type AdminActionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type PlayerListRelationFilter = {
    every?: PlayerWhereInput
    some?: PlayerWhereInput
    none?: PlayerWhereInput
  }

  export type AdminActionListRelationFilter = {
    every?: AdminActionWhereInput
    some?: AdminActionWhereInput
    none?: AdminActionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AdminActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
    isAdmin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expiresAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expiresAt?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type LeagueMembershipListRelationFilter = {
    every?: LeagueMembershipWhereInput
    some?: LeagueMembershipWhereInput
    none?: LeagueMembershipWhereInput
  }

  export type PlayerRatingListRelationFilter = {
    every?: PlayerRatingWhereInput
    some?: PlayerRatingWhereInput
    none?: PlayerRatingWhereInput
  }

  export type ChallengeListRelationFilter = {
    every?: ChallengeWhereInput
    some?: ChallengeWhereInput
    none?: ChallengeWhereInput
  }

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type MatchConfirmationListRelationFilter = {
    every?: MatchConfirmationWhereInput
    some?: MatchConfirmationWhereInput
    none?: MatchConfirmationWhereInput
  }

  export type RatingUpdateListRelationFilter = {
    every?: RatingUpdateWhereInput
    some?: RatingUpdateWhereInput
    none?: RatingUpdateWhereInput
  }

  export type LeagueMembershipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerRatingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChallengeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchConfirmationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RatingUpdateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlayerUserIdNameCompoundUniqueInput = {
    userId: string
    name: string
  }

  export type PlayerCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
  }

  export type PlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
  }

  export type PlayerMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    createdAt?: SortOrder
  }

  export type LeagueCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gameType?: SortOrder
    createdAt?: SortOrder
  }

  export type LeagueMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gameType?: SortOrder
    createdAt?: SortOrder
  }

  export type LeagueMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gameType?: SortOrder
    createdAt?: SortOrder
  }

  export type PlayerScalarRelationFilter = {
    is?: PlayerWhereInput
    isNot?: PlayerWhereInput
  }

  export type LeagueScalarRelationFilter = {
    is?: LeagueWhereInput
    isNot?: LeagueWhereInput
  }

  export type LeagueMembershipPlayerIdLeagueIdCompoundUniqueInput = {
    playerId: string
    leagueId: string
  }

  export type LeagueMembershipCountOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    joinedAt?: SortOrder
    isActive?: SortOrder
  }

  export type LeagueMembershipMaxOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    joinedAt?: SortOrder
    isActive?: SortOrder
  }

  export type LeagueMembershipMinOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    joinedAt?: SortOrder
    isActive?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type PlayerRatingPlayerIdLeagueIdCompoundUniqueInput = {
    playerId: string
    leagueId: string
  }

  export type PlayerRatingCountOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRatingAvgOrderByAggregateInput = {
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
  }

  export type PlayerRatingMaxOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRatingMinOrderByAggregateInput = {
    id?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
    updatedAt?: SortOrder
  }

  export type PlayerRatingSumOrderByAggregateInput = {
    rating?: SortOrder
    gamesPlayed?: SortOrder
    wins?: SortOrder
    losses?: SortOrder
    draws?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type MatchNullableScalarRelationFilter = {
    is?: MatchWhereInput | null
    isNot?: MatchWhereInput | null
  }

  export type ChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    challengerId?: SortOrder
    challengeeId?: SortOrder
    leagueId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    challengerId?: SortOrder
    challengeeId?: SortOrder
    leagueId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    challengerId?: SortOrder
    challengeeId?: SortOrder
    leagueId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
  }

  export type ChallengeNullableScalarRelationFilter = {
    is?: ChallengeWhereInput | null
    isNot?: ChallengeWhereInput | null
  }

  export type PlayerNullableScalarRelationFilter = {
    is?: PlayerWhereInput | null
    isNot?: PlayerWhereInput | null
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    player1Id?: SortOrder
    player2Id?: SortOrder
    leagueId?: SortOrder
    player1Score?: SortOrder
    player2Score?: SortOrder
    winnerId?: SortOrder
    status?: SortOrder
    reportedBy?: SortOrder
    playedAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    player1Score?: SortOrder
    player2Score?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    player1Id?: SortOrder
    player2Id?: SortOrder
    leagueId?: SortOrder
    player1Score?: SortOrder
    player2Score?: SortOrder
    winnerId?: SortOrder
    status?: SortOrder
    reportedBy?: SortOrder
    playedAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    player1Id?: SortOrder
    player2Id?: SortOrder
    leagueId?: SortOrder
    player1Score?: SortOrder
    player2Score?: SortOrder
    winnerId?: SortOrder
    status?: SortOrder
    reportedBy?: SortOrder
    playedAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    player1Score?: SortOrder
    player2Score?: SortOrder
  }

  export type MatchScalarRelationFilter = {
    is?: MatchWhereInput
    isNot?: MatchWhereInput
  }

  export type MatchConfirmationMatchIdPlayerIdCompoundUniqueInput = {
    matchId: string
    playerId: string
  }

  export type MatchConfirmationCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    action?: SortOrder
    confirmedScore1?: SortOrder
    confirmedScore2?: SortOrder
    disputeReason?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchConfirmationAvgOrderByAggregateInput = {
    confirmedScore1?: SortOrder
    confirmedScore2?: SortOrder
  }

  export type MatchConfirmationMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    action?: SortOrder
    confirmedScore1?: SortOrder
    confirmedScore2?: SortOrder
    disputeReason?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchConfirmationMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    action?: SortOrder
    confirmedScore1?: SortOrder
    confirmedScore2?: SortOrder
    disputeReason?: SortOrder
    createdAt?: SortOrder
  }

  export type MatchConfirmationSumOrderByAggregateInput = {
    confirmedScore1?: SortOrder
    confirmedScore2?: SortOrder
  }

  export type RatingUpdateCountOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingUpdateAvgOrderByAggregateInput = {
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
  }

  export type RatingUpdateMaxOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingUpdateMinOrderByAggregateInput = {
    id?: SortOrder
    matchId?: SortOrder
    playerId?: SortOrder
    leagueId?: SortOrder
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
    createdAt?: SortOrder
  }

  export type RatingUpdateSumOrderByAggregateInput = {
    oldRating?: SortOrder
    newRating?: SortOrder
    change?: SortOrder
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AdminActionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminActionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
  }

  export type AdminActionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetId?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PlayerCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type AdminActionCreateNestedManyWithoutUserInput = {
    create?: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput> | AdminActionCreateWithoutUserInput[] | AdminActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminActionCreateOrConnectWithoutUserInput | AdminActionCreateOrConnectWithoutUserInput[]
    createMany?: AdminActionCreateManyUserInputEnvelope
    connect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type PlayerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
  }

  export type AdminActionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput> | AdminActionCreateWithoutUserInput[] | AdminActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminActionCreateOrConnectWithoutUserInput | AdminActionCreateOrConnectWithoutUserInput[]
    createMany?: AdminActionCreateManyUserInputEnvelope
    connect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PlayerUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type AdminActionUpdateManyWithoutUserNestedInput = {
    create?: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput> | AdminActionCreateWithoutUserInput[] | AdminActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminActionCreateOrConnectWithoutUserInput | AdminActionCreateOrConnectWithoutUserInput[]
    upsert?: AdminActionUpsertWithWhereUniqueWithoutUserInput | AdminActionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AdminActionCreateManyUserInputEnvelope
    set?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    disconnect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    delete?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    connect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    update?: AdminActionUpdateWithWhereUniqueWithoutUserInput | AdminActionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AdminActionUpdateManyWithWhereWithoutUserInput | AdminActionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AdminActionScalarWhereInput | AdminActionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type PlayerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput> | PlayerCreateWithoutUserInput[] | PlayerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PlayerCreateOrConnectWithoutUserInput | PlayerCreateOrConnectWithoutUserInput[]
    upsert?: PlayerUpsertWithWhereUniqueWithoutUserInput | PlayerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PlayerCreateManyUserInputEnvelope
    set?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    disconnect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    delete?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    connect?: PlayerWhereUniqueInput | PlayerWhereUniqueInput[]
    update?: PlayerUpdateWithWhereUniqueWithoutUserInput | PlayerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PlayerUpdateManyWithWhereWithoutUserInput | PlayerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
  }

  export type AdminActionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput> | AdminActionCreateWithoutUserInput[] | AdminActionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AdminActionCreateOrConnectWithoutUserInput | AdminActionCreateOrConnectWithoutUserInput[]
    upsert?: AdminActionUpsertWithWhereUniqueWithoutUserInput | AdminActionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AdminActionCreateManyUserInputEnvelope
    set?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    disconnect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    delete?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    connect?: AdminActionWhereUniqueInput | AdminActionWhereUniqueInput[]
    update?: AdminActionUpdateWithWhereUniqueWithoutUserInput | AdminActionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AdminActionUpdateManyWithWhereWithoutUserInput | AdminActionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AdminActionScalarWhereInput | AdminActionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutPlayersInput = {
    create?: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayersInput
    connect?: UserWhereUniqueInput
  }

  export type LeagueMembershipCreateNestedManyWithoutPlayerInput = {
    create?: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput> | LeagueMembershipCreateWithoutPlayerInput[] | LeagueMembershipUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutPlayerInput | LeagueMembershipCreateOrConnectWithoutPlayerInput[]
    createMany?: LeagueMembershipCreateManyPlayerInputEnvelope
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
  }

  export type PlayerRatingCreateNestedManyWithoutPlayerInput = {
    create?: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput> | PlayerRatingCreateWithoutPlayerInput[] | PlayerRatingUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutPlayerInput | PlayerRatingCreateOrConnectWithoutPlayerInput[]
    createMany?: PlayerRatingCreateManyPlayerInputEnvelope
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
  }

  export type ChallengeCreateNestedManyWithoutChallengerInput = {
    create?: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput> | ChallengeCreateWithoutChallengerInput[] | ChallengeUncheckedCreateWithoutChallengerInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengerInput | ChallengeCreateOrConnectWithoutChallengerInput[]
    createMany?: ChallengeCreateManyChallengerInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type ChallengeCreateNestedManyWithoutChallengeeInput = {
    create?: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput> | ChallengeCreateWithoutChallengeeInput[] | ChallengeUncheckedCreateWithoutChallengeeInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengeeInput | ChallengeCreateOrConnectWithoutChallengeeInput[]
    createMany?: ChallengeCreateManyChallengeeInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutPlayer1Input = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutPlayer2Input = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutWinnerInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutReporterInput = {
    create?: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput> | MatchCreateWithoutReporterInput[] | MatchUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutReporterInput | MatchCreateOrConnectWithoutReporterInput[]
    createMany?: MatchCreateManyReporterInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchConfirmationCreateNestedManyWithoutPlayerInput = {
    create?: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput> | MatchConfirmationCreateWithoutPlayerInput[] | MatchConfirmationUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutPlayerInput | MatchConfirmationCreateOrConnectWithoutPlayerInput[]
    createMany?: MatchConfirmationCreateManyPlayerInputEnvelope
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
  }

  export type RatingUpdateCreateNestedManyWithoutPlayerInput = {
    create?: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput> | RatingUpdateCreateWithoutPlayerInput[] | RatingUpdateUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutPlayerInput | RatingUpdateCreateOrConnectWithoutPlayerInput[]
    createMany?: RatingUpdateCreateManyPlayerInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput> | LeagueMembershipCreateWithoutPlayerInput[] | LeagueMembershipUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutPlayerInput | LeagueMembershipCreateOrConnectWithoutPlayerInput[]
    createMany?: LeagueMembershipCreateManyPlayerInputEnvelope
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
  }

  export type PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput> | PlayerRatingCreateWithoutPlayerInput[] | PlayerRatingUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutPlayerInput | PlayerRatingCreateOrConnectWithoutPlayerInput[]
    createMany?: PlayerRatingCreateManyPlayerInputEnvelope
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
  }

  export type ChallengeUncheckedCreateNestedManyWithoutChallengerInput = {
    create?: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput> | ChallengeCreateWithoutChallengerInput[] | ChallengeUncheckedCreateWithoutChallengerInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengerInput | ChallengeCreateOrConnectWithoutChallengerInput[]
    createMany?: ChallengeCreateManyChallengerInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type ChallengeUncheckedCreateNestedManyWithoutChallengeeInput = {
    create?: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput> | ChallengeCreateWithoutChallengeeInput[] | ChallengeUncheckedCreateWithoutChallengeeInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengeeInput | ChallengeCreateOrConnectWithoutChallengeeInput[]
    createMany?: ChallengeCreateManyChallengeeInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutPlayer1Input = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutPlayer2Input = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutReporterInput = {
    create?: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput> | MatchCreateWithoutReporterInput[] | MatchUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutReporterInput | MatchCreateOrConnectWithoutReporterInput[]
    createMany?: MatchCreateManyReporterInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput> | MatchConfirmationCreateWithoutPlayerInput[] | MatchConfirmationUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutPlayerInput | MatchConfirmationCreateOrConnectWithoutPlayerInput[]
    createMany?: MatchConfirmationCreateManyPlayerInputEnvelope
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
  }

  export type RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput = {
    create?: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput> | RatingUpdateCreateWithoutPlayerInput[] | RatingUpdateUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutPlayerInput | RatingUpdateCreateOrConnectWithoutPlayerInput[]
    createMany?: RatingUpdateCreateManyPlayerInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPlayersInput
    upsert?: UserUpsertWithoutPlayersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPlayersInput, UserUpdateWithoutPlayersInput>, UserUncheckedUpdateWithoutPlayersInput>
  }

  export type LeagueMembershipUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput> | LeagueMembershipCreateWithoutPlayerInput[] | LeagueMembershipUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutPlayerInput | LeagueMembershipCreateOrConnectWithoutPlayerInput[]
    upsert?: LeagueMembershipUpsertWithWhereUniqueWithoutPlayerInput | LeagueMembershipUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: LeagueMembershipCreateManyPlayerInputEnvelope
    set?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    disconnect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    delete?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    update?: LeagueMembershipUpdateWithWhereUniqueWithoutPlayerInput | LeagueMembershipUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: LeagueMembershipUpdateManyWithWhereWithoutPlayerInput | LeagueMembershipUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
  }

  export type PlayerRatingUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput> | PlayerRatingCreateWithoutPlayerInput[] | PlayerRatingUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutPlayerInput | PlayerRatingCreateOrConnectWithoutPlayerInput[]
    upsert?: PlayerRatingUpsertWithWhereUniqueWithoutPlayerInput | PlayerRatingUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: PlayerRatingCreateManyPlayerInputEnvelope
    set?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    disconnect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    delete?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    update?: PlayerRatingUpdateWithWhereUniqueWithoutPlayerInput | PlayerRatingUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: PlayerRatingUpdateManyWithWhereWithoutPlayerInput | PlayerRatingUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
  }

  export type ChallengeUpdateManyWithoutChallengerNestedInput = {
    create?: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput> | ChallengeCreateWithoutChallengerInput[] | ChallengeUncheckedCreateWithoutChallengerInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengerInput | ChallengeCreateOrConnectWithoutChallengerInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengerInput | ChallengeUpsertWithWhereUniqueWithoutChallengerInput[]
    createMany?: ChallengeCreateManyChallengerInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutChallengerInput | ChallengeUpdateWithWhereUniqueWithoutChallengerInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutChallengerInput | ChallengeUpdateManyWithWhereWithoutChallengerInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type ChallengeUpdateManyWithoutChallengeeNestedInput = {
    create?: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput> | ChallengeCreateWithoutChallengeeInput[] | ChallengeUncheckedCreateWithoutChallengeeInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengeeInput | ChallengeCreateOrConnectWithoutChallengeeInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengeeInput | ChallengeUpsertWithWhereUniqueWithoutChallengeeInput[]
    createMany?: ChallengeCreateManyChallengeeInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutChallengeeInput | ChallengeUpdateWithWhereUniqueWithoutChallengeeInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutChallengeeInput | ChallengeUpdateManyWithWhereWithoutChallengeeInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutPlayer1NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer1Input | MatchUpsertWithWhereUniqueWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer1Input | MatchUpdateWithWhereUniqueWithoutPlayer1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer1Input | MatchUpdateManyWithWhereWithoutPlayer1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutPlayer2NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer2Input | MatchUpsertWithWhereUniqueWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer2Input | MatchUpdateWithWhereUniqueWithoutPlayer2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer2Input | MatchUpdateManyWithWhereWithoutPlayer2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutWinnerInput | MatchUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutWinnerInput | MatchUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutWinnerInput | MatchUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutReporterNestedInput = {
    create?: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput> | MatchCreateWithoutReporterInput[] | MatchUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutReporterInput | MatchCreateOrConnectWithoutReporterInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutReporterInput | MatchUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: MatchCreateManyReporterInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutReporterInput | MatchUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutReporterInput | MatchUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchConfirmationUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput> | MatchConfirmationCreateWithoutPlayerInput[] | MatchConfirmationUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutPlayerInput | MatchConfirmationCreateOrConnectWithoutPlayerInput[]
    upsert?: MatchConfirmationUpsertWithWhereUniqueWithoutPlayerInput | MatchConfirmationUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: MatchConfirmationCreateManyPlayerInputEnvelope
    set?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    disconnect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    delete?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    update?: MatchConfirmationUpdateWithWhereUniqueWithoutPlayerInput | MatchConfirmationUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: MatchConfirmationUpdateManyWithWhereWithoutPlayerInput | MatchConfirmationUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
  }

  export type RatingUpdateUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput> | RatingUpdateCreateWithoutPlayerInput[] | RatingUpdateUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutPlayerInput | RatingUpdateCreateOrConnectWithoutPlayerInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutPlayerInput | RatingUpdateUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: RatingUpdateCreateManyPlayerInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutPlayerInput | RatingUpdateUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutPlayerInput | RatingUpdateUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput> | LeagueMembershipCreateWithoutPlayerInput[] | LeagueMembershipUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutPlayerInput | LeagueMembershipCreateOrConnectWithoutPlayerInput[]
    upsert?: LeagueMembershipUpsertWithWhereUniqueWithoutPlayerInput | LeagueMembershipUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: LeagueMembershipCreateManyPlayerInputEnvelope
    set?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    disconnect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    delete?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    update?: LeagueMembershipUpdateWithWhereUniqueWithoutPlayerInput | LeagueMembershipUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: LeagueMembershipUpdateManyWithWhereWithoutPlayerInput | LeagueMembershipUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
  }

  export type PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput> | PlayerRatingCreateWithoutPlayerInput[] | PlayerRatingUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutPlayerInput | PlayerRatingCreateOrConnectWithoutPlayerInput[]
    upsert?: PlayerRatingUpsertWithWhereUniqueWithoutPlayerInput | PlayerRatingUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: PlayerRatingCreateManyPlayerInputEnvelope
    set?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    disconnect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    delete?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    update?: PlayerRatingUpdateWithWhereUniqueWithoutPlayerInput | PlayerRatingUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: PlayerRatingUpdateManyWithWhereWithoutPlayerInput | PlayerRatingUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
  }

  export type ChallengeUncheckedUpdateManyWithoutChallengerNestedInput = {
    create?: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput> | ChallengeCreateWithoutChallengerInput[] | ChallengeUncheckedCreateWithoutChallengerInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengerInput | ChallengeCreateOrConnectWithoutChallengerInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengerInput | ChallengeUpsertWithWhereUniqueWithoutChallengerInput[]
    createMany?: ChallengeCreateManyChallengerInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutChallengerInput | ChallengeUpdateWithWhereUniqueWithoutChallengerInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutChallengerInput | ChallengeUpdateManyWithWhereWithoutChallengerInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput = {
    create?: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput> | ChallengeCreateWithoutChallengeeInput[] | ChallengeUncheckedCreateWithoutChallengeeInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutChallengeeInput | ChallengeCreateOrConnectWithoutChallengeeInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutChallengeeInput | ChallengeUpsertWithWhereUniqueWithoutChallengeeInput[]
    createMany?: ChallengeCreateManyChallengeeInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutChallengeeInput | ChallengeUpdateWithWhereUniqueWithoutChallengeeInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutChallengeeInput | ChallengeUpdateManyWithWhereWithoutChallengeeInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutPlayer1NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input> | MatchCreateWithoutPlayer1Input[] | MatchUncheckedCreateWithoutPlayer1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer1Input | MatchCreateOrConnectWithoutPlayer1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer1Input | MatchUpsertWithWhereUniqueWithoutPlayer1Input[]
    createMany?: MatchCreateManyPlayer1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer1Input | MatchUpdateWithWhereUniqueWithoutPlayer1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer1Input | MatchUpdateManyWithWhereWithoutPlayer1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutPlayer2NestedInput = {
    create?: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input> | MatchCreateWithoutPlayer2Input[] | MatchUncheckedCreateWithoutPlayer2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutPlayer2Input | MatchCreateOrConnectWithoutPlayer2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutPlayer2Input | MatchUpsertWithWhereUniqueWithoutPlayer2Input[]
    createMany?: MatchCreateManyPlayer2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutPlayer2Input | MatchUpdateWithWhereUniqueWithoutPlayer2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutPlayer2Input | MatchUpdateManyWithWhereWithoutPlayer2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutWinnerInput | MatchUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutWinnerInput | MatchUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutWinnerInput | MatchUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutReporterNestedInput = {
    create?: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput> | MatchCreateWithoutReporterInput[] | MatchUncheckedCreateWithoutReporterInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutReporterInput | MatchCreateOrConnectWithoutReporterInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutReporterInput | MatchUpsertWithWhereUniqueWithoutReporterInput[]
    createMany?: MatchCreateManyReporterInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutReporterInput | MatchUpdateWithWhereUniqueWithoutReporterInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutReporterInput | MatchUpdateManyWithWhereWithoutReporterInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput> | MatchConfirmationCreateWithoutPlayerInput[] | MatchConfirmationUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutPlayerInput | MatchConfirmationCreateOrConnectWithoutPlayerInput[]
    upsert?: MatchConfirmationUpsertWithWhereUniqueWithoutPlayerInput | MatchConfirmationUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: MatchConfirmationCreateManyPlayerInputEnvelope
    set?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    disconnect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    delete?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    update?: MatchConfirmationUpdateWithWhereUniqueWithoutPlayerInput | MatchConfirmationUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: MatchConfirmationUpdateManyWithWhereWithoutPlayerInput | MatchConfirmationUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
  }

  export type RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput> | RatingUpdateCreateWithoutPlayerInput[] | RatingUpdateUncheckedCreateWithoutPlayerInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutPlayerInput | RatingUpdateCreateOrConnectWithoutPlayerInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutPlayerInput | RatingUpdateUpsertWithWhereUniqueWithoutPlayerInput[]
    createMany?: RatingUpdateCreateManyPlayerInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutPlayerInput | RatingUpdateUpdateWithWhereUniqueWithoutPlayerInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutPlayerInput | RatingUpdateUpdateManyWithWhereWithoutPlayerInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type LeagueMembershipCreateNestedManyWithoutLeagueInput = {
    create?: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput> | LeagueMembershipCreateWithoutLeagueInput[] | LeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutLeagueInput | LeagueMembershipCreateOrConnectWithoutLeagueInput[]
    createMany?: LeagueMembershipCreateManyLeagueInputEnvelope
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
  }

  export type PlayerRatingCreateNestedManyWithoutLeagueInput = {
    create?: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput> | PlayerRatingCreateWithoutLeagueInput[] | PlayerRatingUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutLeagueInput | PlayerRatingCreateOrConnectWithoutLeagueInput[]
    createMany?: PlayerRatingCreateManyLeagueInputEnvelope
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
  }

  export type ChallengeCreateNestedManyWithoutLeagueInput = {
    create?: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput> | ChallengeCreateWithoutLeagueInput[] | ChallengeUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutLeagueInput | ChallengeCreateOrConnectWithoutLeagueInput[]
    createMany?: ChallengeCreateManyLeagueInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutLeagueInput = {
    create?: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput> | MatchCreateWithoutLeagueInput[] | MatchUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutLeagueInput | MatchCreateOrConnectWithoutLeagueInput[]
    createMany?: MatchCreateManyLeagueInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type RatingUpdateCreateNestedManyWithoutLeagueInput = {
    create?: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput> | RatingUpdateCreateWithoutLeagueInput[] | RatingUpdateUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutLeagueInput | RatingUpdateCreateOrConnectWithoutLeagueInput[]
    createMany?: RatingUpdateCreateManyLeagueInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput> | LeagueMembershipCreateWithoutLeagueInput[] | LeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutLeagueInput | LeagueMembershipCreateOrConnectWithoutLeagueInput[]
    createMany?: LeagueMembershipCreateManyLeagueInputEnvelope
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
  }

  export type PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput> | PlayerRatingCreateWithoutLeagueInput[] | PlayerRatingUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutLeagueInput | PlayerRatingCreateOrConnectWithoutLeagueInput[]
    createMany?: PlayerRatingCreateManyLeagueInputEnvelope
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
  }

  export type ChallengeUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput> | ChallengeCreateWithoutLeagueInput[] | ChallengeUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutLeagueInput | ChallengeCreateOrConnectWithoutLeagueInput[]
    createMany?: ChallengeCreateManyLeagueInputEnvelope
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput> | MatchCreateWithoutLeagueInput[] | MatchUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutLeagueInput | MatchCreateOrConnectWithoutLeagueInput[]
    createMany?: MatchCreateManyLeagueInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput = {
    create?: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput> | RatingUpdateCreateWithoutLeagueInput[] | RatingUpdateUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutLeagueInput | RatingUpdateCreateOrConnectWithoutLeagueInput[]
    createMany?: RatingUpdateCreateManyLeagueInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type LeagueMembershipUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput> | LeagueMembershipCreateWithoutLeagueInput[] | LeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutLeagueInput | LeagueMembershipCreateOrConnectWithoutLeagueInput[]
    upsert?: LeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput | LeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: LeagueMembershipCreateManyLeagueInputEnvelope
    set?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    disconnect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    delete?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    update?: LeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput | LeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: LeagueMembershipUpdateManyWithWhereWithoutLeagueInput | LeagueMembershipUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
  }

  export type PlayerRatingUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput> | PlayerRatingCreateWithoutLeagueInput[] | PlayerRatingUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutLeagueInput | PlayerRatingCreateOrConnectWithoutLeagueInput[]
    upsert?: PlayerRatingUpsertWithWhereUniqueWithoutLeagueInput | PlayerRatingUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: PlayerRatingCreateManyLeagueInputEnvelope
    set?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    disconnect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    delete?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    update?: PlayerRatingUpdateWithWhereUniqueWithoutLeagueInput | PlayerRatingUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: PlayerRatingUpdateManyWithWhereWithoutLeagueInput | PlayerRatingUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
  }

  export type ChallengeUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput> | ChallengeCreateWithoutLeagueInput[] | ChallengeUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutLeagueInput | ChallengeCreateOrConnectWithoutLeagueInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutLeagueInput | ChallengeUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: ChallengeCreateManyLeagueInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutLeagueInput | ChallengeUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutLeagueInput | ChallengeUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput> | MatchCreateWithoutLeagueInput[] | MatchUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutLeagueInput | MatchCreateOrConnectWithoutLeagueInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutLeagueInput | MatchUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: MatchCreateManyLeagueInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutLeagueInput | MatchUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutLeagueInput | MatchUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type RatingUpdateUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput> | RatingUpdateCreateWithoutLeagueInput[] | RatingUpdateUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutLeagueInput | RatingUpdateCreateOrConnectWithoutLeagueInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutLeagueInput | RatingUpdateUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: RatingUpdateCreateManyLeagueInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutLeagueInput | RatingUpdateUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutLeagueInput | RatingUpdateUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput> | LeagueMembershipCreateWithoutLeagueInput[] | LeagueMembershipUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: LeagueMembershipCreateOrConnectWithoutLeagueInput | LeagueMembershipCreateOrConnectWithoutLeagueInput[]
    upsert?: LeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput | LeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: LeagueMembershipCreateManyLeagueInputEnvelope
    set?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    disconnect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    delete?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    connect?: LeagueMembershipWhereUniqueInput | LeagueMembershipWhereUniqueInput[]
    update?: LeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput | LeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: LeagueMembershipUpdateManyWithWhereWithoutLeagueInput | LeagueMembershipUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
  }

  export type PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput> | PlayerRatingCreateWithoutLeagueInput[] | PlayerRatingUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: PlayerRatingCreateOrConnectWithoutLeagueInput | PlayerRatingCreateOrConnectWithoutLeagueInput[]
    upsert?: PlayerRatingUpsertWithWhereUniqueWithoutLeagueInput | PlayerRatingUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: PlayerRatingCreateManyLeagueInputEnvelope
    set?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    disconnect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    delete?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    connect?: PlayerRatingWhereUniqueInput | PlayerRatingWhereUniqueInput[]
    update?: PlayerRatingUpdateWithWhereUniqueWithoutLeagueInput | PlayerRatingUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: PlayerRatingUpdateManyWithWhereWithoutLeagueInput | PlayerRatingUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
  }

  export type ChallengeUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput> | ChallengeCreateWithoutLeagueInput[] | ChallengeUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: ChallengeCreateOrConnectWithoutLeagueInput | ChallengeCreateOrConnectWithoutLeagueInput[]
    upsert?: ChallengeUpsertWithWhereUniqueWithoutLeagueInput | ChallengeUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: ChallengeCreateManyLeagueInputEnvelope
    set?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    disconnect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    delete?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    connect?: ChallengeWhereUniqueInput | ChallengeWhereUniqueInput[]
    update?: ChallengeUpdateWithWhereUniqueWithoutLeagueInput | ChallengeUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: ChallengeUpdateManyWithWhereWithoutLeagueInput | ChallengeUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput> | MatchCreateWithoutLeagueInput[] | MatchUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutLeagueInput | MatchCreateOrConnectWithoutLeagueInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutLeagueInput | MatchUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: MatchCreateManyLeagueInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutLeagueInput | MatchUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutLeagueInput | MatchUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput> | RatingUpdateCreateWithoutLeagueInput[] | RatingUpdateUncheckedCreateWithoutLeagueInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutLeagueInput | RatingUpdateCreateOrConnectWithoutLeagueInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutLeagueInput | RatingUpdateUpsertWithWhereUniqueWithoutLeagueInput[]
    createMany?: RatingUpdateCreateManyLeagueInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutLeagueInput | RatingUpdateUpdateWithWhereUniqueWithoutLeagueInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutLeagueInput | RatingUpdateUpdateManyWithWhereWithoutLeagueInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type PlayerCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<PlayerCreateWithoutMembershipsInput, PlayerUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMembershipsInput
    connect?: PlayerWhereUniqueInput
  }

  export type LeagueCreateNestedOneWithoutMembershipsInput = {
    create?: XOR<LeagueCreateWithoutMembershipsInput, LeagueUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutMembershipsInput
    connect?: LeagueWhereUniqueInput
  }

  export type PlayerUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<PlayerCreateWithoutMembershipsInput, PlayerUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMembershipsInput
    upsert?: PlayerUpsertWithoutMembershipsInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMembershipsInput, PlayerUpdateWithoutMembershipsInput>, PlayerUncheckedUpdateWithoutMembershipsInput>
  }

  export type LeagueUpdateOneRequiredWithoutMembershipsNestedInput = {
    create?: XOR<LeagueCreateWithoutMembershipsInput, LeagueUncheckedCreateWithoutMembershipsInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutMembershipsInput
    upsert?: LeagueUpsertWithoutMembershipsInput
    connect?: LeagueWhereUniqueInput
    update?: XOR<XOR<LeagueUpdateToOneWithWhereWithoutMembershipsInput, LeagueUpdateWithoutMembershipsInput>, LeagueUncheckedUpdateWithoutMembershipsInput>
  }

  export type PlayerCreateNestedOneWithoutRatingsInput = {
    create?: XOR<PlayerCreateWithoutRatingsInput, PlayerUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutRatingsInput
    connect?: PlayerWhereUniqueInput
  }

  export type LeagueCreateNestedOneWithoutRatingsInput = {
    create?: XOR<LeagueCreateWithoutRatingsInput, LeagueUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutRatingsInput
    connect?: LeagueWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PlayerUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<PlayerCreateWithoutRatingsInput, PlayerUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutRatingsInput
    upsert?: PlayerUpsertWithoutRatingsInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutRatingsInput, PlayerUpdateWithoutRatingsInput>, PlayerUncheckedUpdateWithoutRatingsInput>
  }

  export type LeagueUpdateOneRequiredWithoutRatingsNestedInput = {
    create?: XOR<LeagueCreateWithoutRatingsInput, LeagueUncheckedCreateWithoutRatingsInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutRatingsInput
    upsert?: LeagueUpsertWithoutRatingsInput
    connect?: LeagueWhereUniqueInput
    update?: XOR<XOR<LeagueUpdateToOneWithWhereWithoutRatingsInput, LeagueUpdateWithoutRatingsInput>, LeagueUncheckedUpdateWithoutRatingsInput>
  }

  export type PlayerCreateNestedOneWithoutChallengesSentInput = {
    create?: XOR<PlayerCreateWithoutChallengesSentInput, PlayerUncheckedCreateWithoutChallengesSentInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutChallengesSentInput
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutChallengesReceivedInput = {
    create?: XOR<PlayerCreateWithoutChallengesReceivedInput, PlayerUncheckedCreateWithoutChallengesReceivedInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutChallengesReceivedInput
    connect?: PlayerWhereUniqueInput
  }

  export type LeagueCreateNestedOneWithoutChallengesInput = {
    create?: XOR<LeagueCreateWithoutChallengesInput, LeagueUncheckedCreateWithoutChallengesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutChallengesInput
    connect?: LeagueWhereUniqueInput
  }

  export type MatchCreateNestedOneWithoutChallengeInput = {
    create?: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
    connectOrCreate?: MatchCreateOrConnectWithoutChallengeInput
    connect?: MatchWhereUniqueInput
  }

  export type MatchUncheckedCreateNestedOneWithoutChallengeInput = {
    create?: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
    connectOrCreate?: MatchCreateOrConnectWithoutChallengeInput
    connect?: MatchWhereUniqueInput
  }

  export type PlayerUpdateOneRequiredWithoutChallengesSentNestedInput = {
    create?: XOR<PlayerCreateWithoutChallengesSentInput, PlayerUncheckedCreateWithoutChallengesSentInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutChallengesSentInput
    upsert?: PlayerUpsertWithoutChallengesSentInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutChallengesSentInput, PlayerUpdateWithoutChallengesSentInput>, PlayerUncheckedUpdateWithoutChallengesSentInput>
  }

  export type PlayerUpdateOneRequiredWithoutChallengesReceivedNestedInput = {
    create?: XOR<PlayerCreateWithoutChallengesReceivedInput, PlayerUncheckedCreateWithoutChallengesReceivedInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutChallengesReceivedInput
    upsert?: PlayerUpsertWithoutChallengesReceivedInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutChallengesReceivedInput, PlayerUpdateWithoutChallengesReceivedInput>, PlayerUncheckedUpdateWithoutChallengesReceivedInput>
  }

  export type LeagueUpdateOneRequiredWithoutChallengesNestedInput = {
    create?: XOR<LeagueCreateWithoutChallengesInput, LeagueUncheckedCreateWithoutChallengesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutChallengesInput
    upsert?: LeagueUpsertWithoutChallengesInput
    connect?: LeagueWhereUniqueInput
    update?: XOR<XOR<LeagueUpdateToOneWithWhereWithoutChallengesInput, LeagueUpdateWithoutChallengesInput>, LeagueUncheckedUpdateWithoutChallengesInput>
  }

  export type MatchUpdateOneWithoutChallengeNestedInput = {
    create?: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
    connectOrCreate?: MatchCreateOrConnectWithoutChallengeInput
    upsert?: MatchUpsertWithoutChallengeInput
    disconnect?: MatchWhereInput | boolean
    delete?: MatchWhereInput | boolean
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutChallengeInput, MatchUpdateWithoutChallengeInput>, MatchUncheckedUpdateWithoutChallengeInput>
  }

  export type MatchUncheckedUpdateOneWithoutChallengeNestedInput = {
    create?: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
    connectOrCreate?: MatchCreateOrConnectWithoutChallengeInput
    upsert?: MatchUpsertWithoutChallengeInput
    disconnect?: MatchWhereInput | boolean
    delete?: MatchWhereInput | boolean
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutChallengeInput, MatchUpdateWithoutChallengeInput>, MatchUncheckedUpdateWithoutChallengeInput>
  }

  export type ChallengeCreateNestedOneWithoutMatchInput = {
    create?: XOR<ChallengeCreateWithoutMatchInput, ChallengeUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChallengeCreateOrConnectWithoutMatchInput
    connect?: ChallengeWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutMatchesAsPlayer1Input = {
    create?: XOR<PlayerCreateWithoutMatchesAsPlayer1Input, PlayerUncheckedCreateWithoutMatchesAsPlayer1Input>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesAsPlayer1Input
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutMatchesAsPlayer2Input = {
    create?: XOR<PlayerCreateWithoutMatchesAsPlayer2Input, PlayerUncheckedCreateWithoutMatchesAsPlayer2Input>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesAsPlayer2Input
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutMatchesWonInput = {
    create?: XOR<PlayerCreateWithoutMatchesWonInput, PlayerUncheckedCreateWithoutMatchesWonInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesWonInput
    connect?: PlayerWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutMatchesReportedInput = {
    create?: XOR<PlayerCreateWithoutMatchesReportedInput, PlayerUncheckedCreateWithoutMatchesReportedInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesReportedInput
    connect?: PlayerWhereUniqueInput
  }

  export type LeagueCreateNestedOneWithoutMatchesInput = {
    create?: XOR<LeagueCreateWithoutMatchesInput, LeagueUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutMatchesInput
    connect?: LeagueWhereUniqueInput
  }

  export type MatchConfirmationCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput> | MatchConfirmationCreateWithoutMatchInput[] | MatchConfirmationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutMatchInput | MatchConfirmationCreateOrConnectWithoutMatchInput[]
    createMany?: MatchConfirmationCreateManyMatchInputEnvelope
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
  }

  export type RatingUpdateCreateNestedManyWithoutMatchInput = {
    create?: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput> | RatingUpdateCreateWithoutMatchInput[] | RatingUpdateUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutMatchInput | RatingUpdateCreateOrConnectWithoutMatchInput[]
    createMany?: RatingUpdateCreateManyMatchInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput> | MatchConfirmationCreateWithoutMatchInput[] | MatchConfirmationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutMatchInput | MatchConfirmationCreateOrConnectWithoutMatchInput[]
    createMany?: MatchConfirmationCreateManyMatchInputEnvelope
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
  }

  export type RatingUpdateUncheckedCreateNestedManyWithoutMatchInput = {
    create?: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput> | RatingUpdateCreateWithoutMatchInput[] | RatingUpdateUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutMatchInput | RatingUpdateCreateOrConnectWithoutMatchInput[]
    createMany?: RatingUpdateCreateManyMatchInputEnvelope
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
  }

  export type ChallengeUpdateOneWithoutMatchNestedInput = {
    create?: XOR<ChallengeCreateWithoutMatchInput, ChallengeUncheckedCreateWithoutMatchInput>
    connectOrCreate?: ChallengeCreateOrConnectWithoutMatchInput
    upsert?: ChallengeUpsertWithoutMatchInput
    disconnect?: ChallengeWhereInput | boolean
    delete?: ChallengeWhereInput | boolean
    connect?: ChallengeWhereUniqueInput
    update?: XOR<XOR<ChallengeUpdateToOneWithWhereWithoutMatchInput, ChallengeUpdateWithoutMatchInput>, ChallengeUncheckedUpdateWithoutMatchInput>
  }

  export type PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput = {
    create?: XOR<PlayerCreateWithoutMatchesAsPlayer1Input, PlayerUncheckedCreateWithoutMatchesAsPlayer1Input>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesAsPlayer1Input
    upsert?: PlayerUpsertWithoutMatchesAsPlayer1Input
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMatchesAsPlayer1Input, PlayerUpdateWithoutMatchesAsPlayer1Input>, PlayerUncheckedUpdateWithoutMatchesAsPlayer1Input>
  }

  export type PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput = {
    create?: XOR<PlayerCreateWithoutMatchesAsPlayer2Input, PlayerUncheckedCreateWithoutMatchesAsPlayer2Input>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesAsPlayer2Input
    upsert?: PlayerUpsertWithoutMatchesAsPlayer2Input
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMatchesAsPlayer2Input, PlayerUpdateWithoutMatchesAsPlayer2Input>, PlayerUncheckedUpdateWithoutMatchesAsPlayer2Input>
  }

  export type PlayerUpdateOneWithoutMatchesWonNestedInput = {
    create?: XOR<PlayerCreateWithoutMatchesWonInput, PlayerUncheckedCreateWithoutMatchesWonInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesWonInput
    upsert?: PlayerUpsertWithoutMatchesWonInput
    disconnect?: PlayerWhereInput | boolean
    delete?: PlayerWhereInput | boolean
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMatchesWonInput, PlayerUpdateWithoutMatchesWonInput>, PlayerUncheckedUpdateWithoutMatchesWonInput>
  }

  export type PlayerUpdateOneWithoutMatchesReportedNestedInput = {
    create?: XOR<PlayerCreateWithoutMatchesReportedInput, PlayerUncheckedCreateWithoutMatchesReportedInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchesReportedInput
    upsert?: PlayerUpsertWithoutMatchesReportedInput
    disconnect?: PlayerWhereInput | boolean
    delete?: PlayerWhereInput | boolean
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMatchesReportedInput, PlayerUpdateWithoutMatchesReportedInput>, PlayerUncheckedUpdateWithoutMatchesReportedInput>
  }

  export type LeagueUpdateOneRequiredWithoutMatchesNestedInput = {
    create?: XOR<LeagueCreateWithoutMatchesInput, LeagueUncheckedCreateWithoutMatchesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutMatchesInput
    upsert?: LeagueUpsertWithoutMatchesInput
    connect?: LeagueWhereUniqueInput
    update?: XOR<XOR<LeagueUpdateToOneWithWhereWithoutMatchesInput, LeagueUpdateWithoutMatchesInput>, LeagueUncheckedUpdateWithoutMatchesInput>
  }

  export type MatchConfirmationUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput> | MatchConfirmationCreateWithoutMatchInput[] | MatchConfirmationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutMatchInput | MatchConfirmationCreateOrConnectWithoutMatchInput[]
    upsert?: MatchConfirmationUpsertWithWhereUniqueWithoutMatchInput | MatchConfirmationUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchConfirmationCreateManyMatchInputEnvelope
    set?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    disconnect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    delete?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    update?: MatchConfirmationUpdateWithWhereUniqueWithoutMatchInput | MatchConfirmationUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchConfirmationUpdateManyWithWhereWithoutMatchInput | MatchConfirmationUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
  }

  export type RatingUpdateUpdateManyWithoutMatchNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput> | RatingUpdateCreateWithoutMatchInput[] | RatingUpdateUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutMatchInput | RatingUpdateCreateOrConnectWithoutMatchInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutMatchInput | RatingUpdateUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: RatingUpdateCreateManyMatchInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutMatchInput | RatingUpdateUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutMatchInput | RatingUpdateUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput> | MatchConfirmationCreateWithoutMatchInput[] | MatchConfirmationUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: MatchConfirmationCreateOrConnectWithoutMatchInput | MatchConfirmationCreateOrConnectWithoutMatchInput[]
    upsert?: MatchConfirmationUpsertWithWhereUniqueWithoutMatchInput | MatchConfirmationUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: MatchConfirmationCreateManyMatchInputEnvelope
    set?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    disconnect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    delete?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    connect?: MatchConfirmationWhereUniqueInput | MatchConfirmationWhereUniqueInput[]
    update?: MatchConfirmationUpdateWithWhereUniqueWithoutMatchInput | MatchConfirmationUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: MatchConfirmationUpdateManyWithWhereWithoutMatchInput | MatchConfirmationUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
  }

  export type RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput = {
    create?: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput> | RatingUpdateCreateWithoutMatchInput[] | RatingUpdateUncheckedCreateWithoutMatchInput[]
    connectOrCreate?: RatingUpdateCreateOrConnectWithoutMatchInput | RatingUpdateCreateOrConnectWithoutMatchInput[]
    upsert?: RatingUpdateUpsertWithWhereUniqueWithoutMatchInput | RatingUpdateUpsertWithWhereUniqueWithoutMatchInput[]
    createMany?: RatingUpdateCreateManyMatchInputEnvelope
    set?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    disconnect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    delete?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    connect?: RatingUpdateWhereUniqueInput | RatingUpdateWhereUniqueInput[]
    update?: RatingUpdateUpdateWithWhereUniqueWithoutMatchInput | RatingUpdateUpdateWithWhereUniqueWithoutMatchInput[]
    updateMany?: RatingUpdateUpdateManyWithWhereWithoutMatchInput | RatingUpdateUpdateManyWithWhereWithoutMatchInput[]
    deleteMany?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
  }

  export type MatchCreateNestedOneWithoutConfirmationsInput = {
    create?: XOR<MatchCreateWithoutConfirmationsInput, MatchUncheckedCreateWithoutConfirmationsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutConfirmationsInput
    connect?: MatchWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutMatchConfirmationsInput = {
    create?: XOR<PlayerCreateWithoutMatchConfirmationsInput, PlayerUncheckedCreateWithoutMatchConfirmationsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchConfirmationsInput
    connect?: PlayerWhereUniqueInput
  }

  export type MatchUpdateOneRequiredWithoutConfirmationsNestedInput = {
    create?: XOR<MatchCreateWithoutConfirmationsInput, MatchUncheckedCreateWithoutConfirmationsInput>
    connectOrCreate?: MatchCreateOrConnectWithoutConfirmationsInput
    upsert?: MatchUpsertWithoutConfirmationsInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutConfirmationsInput, MatchUpdateWithoutConfirmationsInput>, MatchUncheckedUpdateWithoutConfirmationsInput>
  }

  export type PlayerUpdateOneRequiredWithoutMatchConfirmationsNestedInput = {
    create?: XOR<PlayerCreateWithoutMatchConfirmationsInput, PlayerUncheckedCreateWithoutMatchConfirmationsInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutMatchConfirmationsInput
    upsert?: PlayerUpsertWithoutMatchConfirmationsInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutMatchConfirmationsInput, PlayerUpdateWithoutMatchConfirmationsInput>, PlayerUncheckedUpdateWithoutMatchConfirmationsInput>
  }

  export type MatchCreateNestedOneWithoutRatingUpdatesInput = {
    create?: XOR<MatchCreateWithoutRatingUpdatesInput, MatchUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: MatchCreateOrConnectWithoutRatingUpdatesInput
    connect?: MatchWhereUniqueInput
  }

  export type PlayerCreateNestedOneWithoutRatingUpdatesInput = {
    create?: XOR<PlayerCreateWithoutRatingUpdatesInput, PlayerUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutRatingUpdatesInput
    connect?: PlayerWhereUniqueInput
  }

  export type LeagueCreateNestedOneWithoutRatingUpdatesInput = {
    create?: XOR<LeagueCreateWithoutRatingUpdatesInput, LeagueUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutRatingUpdatesInput
    connect?: LeagueWhereUniqueInput
  }

  export type MatchUpdateOneRequiredWithoutRatingUpdatesNestedInput = {
    create?: XOR<MatchCreateWithoutRatingUpdatesInput, MatchUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: MatchCreateOrConnectWithoutRatingUpdatesInput
    upsert?: MatchUpsertWithoutRatingUpdatesInput
    connect?: MatchWhereUniqueInput
    update?: XOR<XOR<MatchUpdateToOneWithWhereWithoutRatingUpdatesInput, MatchUpdateWithoutRatingUpdatesInput>, MatchUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type PlayerUpdateOneRequiredWithoutRatingUpdatesNestedInput = {
    create?: XOR<PlayerCreateWithoutRatingUpdatesInput, PlayerUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: PlayerCreateOrConnectWithoutRatingUpdatesInput
    upsert?: PlayerUpsertWithoutRatingUpdatesInput
    connect?: PlayerWhereUniqueInput
    update?: XOR<XOR<PlayerUpdateToOneWithWhereWithoutRatingUpdatesInput, PlayerUpdateWithoutRatingUpdatesInput>, PlayerUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type LeagueUpdateOneRequiredWithoutRatingUpdatesNestedInput = {
    create?: XOR<LeagueCreateWithoutRatingUpdatesInput, LeagueUncheckedCreateWithoutRatingUpdatesInput>
    connectOrCreate?: LeagueCreateOrConnectWithoutRatingUpdatesInput
    upsert?: LeagueUpsertWithoutRatingUpdatesInput
    connect?: LeagueWhereUniqueInput
    update?: XOR<XOR<LeagueUpdateToOneWithWhereWithoutRatingUpdatesInput, LeagueUpdateWithoutRatingUpdatesInput>, LeagueUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type UserCreateNestedOneWithoutAdminActionsInput = {
    create?: XOR<UserCreateWithoutAdminActionsInput, UserUncheckedCreateWithoutAdminActionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminActionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutAdminActionsNestedInput = {
    create?: XOR<UserCreateWithoutAdminActionsInput, UserUncheckedCreateWithoutAdminActionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminActionsInput
    upsert?: UserUpsertWithoutAdminActionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdminActionsInput, UserUpdateWithoutAdminActionsInput>, UserUncheckedUpdateWithoutAdminActionsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PlayerCreateWithoutUserInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutUserInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerCreateManyUserInputEnvelope = {
    data: PlayerCreateManyUserInput | PlayerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AdminActionCreateWithoutUserInput = {
    id?: string
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
  }

  export type AdminActionUncheckedCreateWithoutUserInput = {
    id?: string
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
  }

  export type AdminActionCreateOrConnectWithoutUserInput = {
    where: AdminActionWhereUniqueInput
    create: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput>
  }

  export type AdminActionCreateManyUserInputEnvelope = {
    data: AdminActionCreateManyUserInput | AdminActionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type PlayerUpsertWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    update: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
    create: XOR<PlayerCreateWithoutUserInput, PlayerUncheckedCreateWithoutUserInput>
  }

  export type PlayerUpdateWithWhereUniqueWithoutUserInput = {
    where: PlayerWhereUniqueInput
    data: XOR<PlayerUpdateWithoutUserInput, PlayerUncheckedUpdateWithoutUserInput>
  }

  export type PlayerUpdateManyWithWhereWithoutUserInput = {
    where: PlayerScalarWhereInput
    data: XOR<PlayerUpdateManyMutationInput, PlayerUncheckedUpdateManyWithoutUserInput>
  }

  export type PlayerScalarWhereInput = {
    AND?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    OR?: PlayerScalarWhereInput[]
    NOT?: PlayerScalarWhereInput | PlayerScalarWhereInput[]
    id?: StringFilter<"Player"> | string
    userId?: StringFilter<"Player"> | string
    name?: StringFilter<"Player"> | string
    email?: StringNullableFilter<"Player"> | string | null
    avatar?: StringNullableFilter<"Player"> | string | null
    createdAt?: DateTimeFilter<"Player"> | Date | string
  }

  export type AdminActionUpsertWithWhereUniqueWithoutUserInput = {
    where: AdminActionWhereUniqueInput
    update: XOR<AdminActionUpdateWithoutUserInput, AdminActionUncheckedUpdateWithoutUserInput>
    create: XOR<AdminActionCreateWithoutUserInput, AdminActionUncheckedCreateWithoutUserInput>
  }

  export type AdminActionUpdateWithWhereUniqueWithoutUserInput = {
    where: AdminActionWhereUniqueInput
    data: XOR<AdminActionUpdateWithoutUserInput, AdminActionUncheckedUpdateWithoutUserInput>
  }

  export type AdminActionUpdateManyWithWhereWithoutUserInput = {
    where: AdminActionScalarWhereInput
    data: XOR<AdminActionUpdateManyMutationInput, AdminActionUncheckedUpdateManyWithoutUserInput>
  }

  export type AdminActionScalarWhereInput = {
    AND?: AdminActionScalarWhereInput | AdminActionScalarWhereInput[]
    OR?: AdminActionScalarWhereInput[]
    NOT?: AdminActionScalarWhereInput | AdminActionScalarWhereInput[]
    id?: StringFilter<"AdminAction"> | string
    userId?: StringNullableFilter<"AdminAction"> | string | null
    action?: StringFilter<"AdminAction"> | string
    targetId?: StringNullableFilter<"AdminAction"> | string | null
    details?: StringNullableFilter<"AdminAction"> | string | null
    createdAt?: DateTimeFilter<"AdminAction"> | Date | string
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    players?: PlayerCreateNestedManyWithoutUserInput
    adminActions?: AdminActionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    adminActions?: AdminActionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    players?: PlayerCreateNestedManyWithoutUserInput
    adminActions?: AdminActionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
    adminActions?: AdminActionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPlayersInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    adminActions?: AdminActionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPlayersInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    adminActions?: AdminActionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPlayersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
  }

  export type LeagueMembershipCreateWithoutPlayerInput = {
    id?: string
    joinedAt?: Date | string
    isActive?: boolean
    league: LeagueCreateNestedOneWithoutMembershipsInput
  }

  export type LeagueMembershipUncheckedCreateWithoutPlayerInput = {
    id?: string
    leagueId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type LeagueMembershipCreateOrConnectWithoutPlayerInput = {
    where: LeagueMembershipWhereUniqueInput
    create: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput>
  }

  export type LeagueMembershipCreateManyPlayerInputEnvelope = {
    data: LeagueMembershipCreateManyPlayerInput | LeagueMembershipCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type PlayerRatingCreateWithoutPlayerInput = {
    id?: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
    league: LeagueCreateNestedOneWithoutRatingsInput
  }

  export type PlayerRatingUncheckedCreateWithoutPlayerInput = {
    id?: string
    leagueId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type PlayerRatingCreateOrConnectWithoutPlayerInput = {
    where: PlayerRatingWhereUniqueInput
    create: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput>
  }

  export type PlayerRatingCreateManyPlayerInputEnvelope = {
    data: PlayerRatingCreateManyPlayerInput | PlayerRatingCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeCreateWithoutChallengerInput = {
    id?: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    challengee: PlayerCreateNestedOneWithoutChallengesReceivedInput
    league: LeagueCreateNestedOneWithoutChallengesInput
    match?: MatchCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeUncheckedCreateWithoutChallengerInput = {
    id?: string
    challengeeId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    match?: MatchUncheckedCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeCreateOrConnectWithoutChallengerInput = {
    where: ChallengeWhereUniqueInput
    create: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput>
  }

  export type ChallengeCreateManyChallengerInputEnvelope = {
    data: ChallengeCreateManyChallengerInput | ChallengeCreateManyChallengerInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeCreateWithoutChallengeeInput = {
    id?: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    challenger: PlayerCreateNestedOneWithoutChallengesSentInput
    league: LeagueCreateNestedOneWithoutChallengesInput
    match?: MatchCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeUncheckedCreateWithoutChallengeeInput = {
    id?: string
    challengerId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    match?: MatchUncheckedCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeCreateOrConnectWithoutChallengeeInput = {
    where: ChallengeWhereUniqueInput
    create: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput>
  }

  export type ChallengeCreateManyChallengeeInputEnvelope = {
    data: ChallengeCreateManyChallengeeInput | ChallengeCreateManyChallengeeInput[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutPlayer1Input = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutPlayer1Input = {
    id?: string
    challengeId?: string | null
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input>
  }

  export type MatchCreateManyPlayer1InputEnvelope = {
    data: MatchCreateManyPlayer1Input | MatchCreateManyPlayer1Input[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutPlayer2Input = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutPlayer2Input = {
    id?: string
    challengeId?: string | null
    player1Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input>
  }

  export type MatchCreateManyPlayer2InputEnvelope = {
    data: MatchCreateManyPlayer2Input | MatchCreateManyPlayer2Input[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutWinnerInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutWinnerInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput>
  }

  export type MatchCreateManyWinnerInputEnvelope = {
    data: MatchCreateManyWinnerInput | MatchCreateManyWinnerInput[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutReporterInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutReporterInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutReporterInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput>
  }

  export type MatchCreateManyReporterInputEnvelope = {
    data: MatchCreateManyReporterInput | MatchCreateManyReporterInput[]
    skipDuplicates?: boolean
  }

  export type MatchConfirmationCreateWithoutPlayerInput = {
    id?: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutConfirmationsInput
  }

  export type MatchConfirmationUncheckedCreateWithoutPlayerInput = {
    id?: string
    matchId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type MatchConfirmationCreateOrConnectWithoutPlayerInput = {
    where: MatchConfirmationWhereUniqueInput
    create: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput>
  }

  export type MatchConfirmationCreateManyPlayerInputEnvelope = {
    data: MatchConfirmationCreateManyPlayerInput | MatchConfirmationCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type RatingUpdateCreateWithoutPlayerInput = {
    id?: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutRatingUpdatesInput
    league: LeagueCreateNestedOneWithoutRatingUpdatesInput
  }

  export type RatingUpdateUncheckedCreateWithoutPlayerInput = {
    id?: string
    matchId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type RatingUpdateCreateOrConnectWithoutPlayerInput = {
    where: RatingUpdateWhereUniqueInput
    create: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput>
  }

  export type RatingUpdateCreateManyPlayerInputEnvelope = {
    data: RatingUpdateCreateManyPlayerInput | RatingUpdateCreateManyPlayerInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPlayersInput = {
    update: XOR<UserUpdateWithoutPlayersInput, UserUncheckedUpdateWithoutPlayersInput>
    create: XOR<UserCreateWithoutPlayersInput, UserUncheckedCreateWithoutPlayersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPlayersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPlayersInput, UserUncheckedUpdateWithoutPlayersInput>
  }

  export type UserUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    adminActions?: AdminActionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LeagueMembershipUpsertWithWhereUniqueWithoutPlayerInput = {
    where: LeagueMembershipWhereUniqueInput
    update: XOR<LeagueMembershipUpdateWithoutPlayerInput, LeagueMembershipUncheckedUpdateWithoutPlayerInput>
    create: XOR<LeagueMembershipCreateWithoutPlayerInput, LeagueMembershipUncheckedCreateWithoutPlayerInput>
  }

  export type LeagueMembershipUpdateWithWhereUniqueWithoutPlayerInput = {
    where: LeagueMembershipWhereUniqueInput
    data: XOR<LeagueMembershipUpdateWithoutPlayerInput, LeagueMembershipUncheckedUpdateWithoutPlayerInput>
  }

  export type LeagueMembershipUpdateManyWithWhereWithoutPlayerInput = {
    where: LeagueMembershipScalarWhereInput
    data: XOR<LeagueMembershipUpdateManyMutationInput, LeagueMembershipUncheckedUpdateManyWithoutPlayerInput>
  }

  export type LeagueMembershipScalarWhereInput = {
    AND?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
    OR?: LeagueMembershipScalarWhereInput[]
    NOT?: LeagueMembershipScalarWhereInput | LeagueMembershipScalarWhereInput[]
    id?: StringFilter<"LeagueMembership"> | string
    playerId?: StringFilter<"LeagueMembership"> | string
    leagueId?: StringFilter<"LeagueMembership"> | string
    joinedAt?: DateTimeFilter<"LeagueMembership"> | Date | string
    isActive?: BoolFilter<"LeagueMembership"> | boolean
  }

  export type PlayerRatingUpsertWithWhereUniqueWithoutPlayerInput = {
    where: PlayerRatingWhereUniqueInput
    update: XOR<PlayerRatingUpdateWithoutPlayerInput, PlayerRatingUncheckedUpdateWithoutPlayerInput>
    create: XOR<PlayerRatingCreateWithoutPlayerInput, PlayerRatingUncheckedCreateWithoutPlayerInput>
  }

  export type PlayerRatingUpdateWithWhereUniqueWithoutPlayerInput = {
    where: PlayerRatingWhereUniqueInput
    data: XOR<PlayerRatingUpdateWithoutPlayerInput, PlayerRatingUncheckedUpdateWithoutPlayerInput>
  }

  export type PlayerRatingUpdateManyWithWhereWithoutPlayerInput = {
    where: PlayerRatingScalarWhereInput
    data: XOR<PlayerRatingUpdateManyMutationInput, PlayerRatingUncheckedUpdateManyWithoutPlayerInput>
  }

  export type PlayerRatingScalarWhereInput = {
    AND?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
    OR?: PlayerRatingScalarWhereInput[]
    NOT?: PlayerRatingScalarWhereInput | PlayerRatingScalarWhereInput[]
    id?: StringFilter<"PlayerRating"> | string
    playerId?: StringFilter<"PlayerRating"> | string
    leagueId?: StringFilter<"PlayerRating"> | string
    rating?: IntFilter<"PlayerRating"> | number
    gamesPlayed?: IntFilter<"PlayerRating"> | number
    wins?: IntFilter<"PlayerRating"> | number
    losses?: IntFilter<"PlayerRating"> | number
    draws?: IntFilter<"PlayerRating"> | number
    updatedAt?: DateTimeFilter<"PlayerRating"> | Date | string
  }

  export type ChallengeUpsertWithWhereUniqueWithoutChallengerInput = {
    where: ChallengeWhereUniqueInput
    update: XOR<ChallengeUpdateWithoutChallengerInput, ChallengeUncheckedUpdateWithoutChallengerInput>
    create: XOR<ChallengeCreateWithoutChallengerInput, ChallengeUncheckedCreateWithoutChallengerInput>
  }

  export type ChallengeUpdateWithWhereUniqueWithoutChallengerInput = {
    where: ChallengeWhereUniqueInput
    data: XOR<ChallengeUpdateWithoutChallengerInput, ChallengeUncheckedUpdateWithoutChallengerInput>
  }

  export type ChallengeUpdateManyWithWhereWithoutChallengerInput = {
    where: ChallengeScalarWhereInput
    data: XOR<ChallengeUpdateManyMutationInput, ChallengeUncheckedUpdateManyWithoutChallengerInput>
  }

  export type ChallengeScalarWhereInput = {
    AND?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
    OR?: ChallengeScalarWhereInput[]
    NOT?: ChallengeScalarWhereInput | ChallengeScalarWhereInput[]
    id?: StringFilter<"Challenge"> | string
    challengerId?: StringFilter<"Challenge"> | string
    challengeeId?: StringFilter<"Challenge"> | string
    leagueId?: StringFilter<"Challenge"> | string
    status?: StringFilter<"Challenge"> | string
    createdAt?: DateTimeFilter<"Challenge"> | Date | string
    expiresAt?: DateTimeNullableFilter<"Challenge"> | Date | string | null
  }

  export type ChallengeUpsertWithWhereUniqueWithoutChallengeeInput = {
    where: ChallengeWhereUniqueInput
    update: XOR<ChallengeUpdateWithoutChallengeeInput, ChallengeUncheckedUpdateWithoutChallengeeInput>
    create: XOR<ChallengeCreateWithoutChallengeeInput, ChallengeUncheckedCreateWithoutChallengeeInput>
  }

  export type ChallengeUpdateWithWhereUniqueWithoutChallengeeInput = {
    where: ChallengeWhereUniqueInput
    data: XOR<ChallengeUpdateWithoutChallengeeInput, ChallengeUncheckedUpdateWithoutChallengeeInput>
  }

  export type ChallengeUpdateManyWithWhereWithoutChallengeeInput = {
    where: ChallengeScalarWhereInput
    data: XOR<ChallengeUpdateManyMutationInput, ChallengeUncheckedUpdateManyWithoutChallengeeInput>
  }

  export type MatchUpsertWithWhereUniqueWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutPlayer1Input, MatchUncheckedUpdateWithoutPlayer1Input>
    create: XOR<MatchCreateWithoutPlayer1Input, MatchUncheckedCreateWithoutPlayer1Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutPlayer1Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutPlayer1Input, MatchUncheckedUpdateWithoutPlayer1Input>
  }

  export type MatchUpdateManyWithWhereWithoutPlayer1Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutPlayer1Input>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    challengeId?: StringNullableFilter<"Match"> | string | null
    player1Id?: StringFilter<"Match"> | string
    player2Id?: StringFilter<"Match"> | string
    leagueId?: StringFilter<"Match"> | string
    player1Score?: IntFilter<"Match"> | number
    player2Score?: IntFilter<"Match"> | number
    winnerId?: StringNullableFilter<"Match"> | string | null
    status?: StringFilter<"Match"> | string
    reportedBy?: StringNullableFilter<"Match"> | string | null
    playedAt?: DateTimeFilter<"Match"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"Match"> | Date | string | null
  }

  export type MatchUpsertWithWhereUniqueWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutPlayer2Input, MatchUncheckedUpdateWithoutPlayer2Input>
    create: XOR<MatchCreateWithoutPlayer2Input, MatchUncheckedCreateWithoutPlayer2Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutPlayer2Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutPlayer2Input, MatchUncheckedUpdateWithoutPlayer2Input>
  }

  export type MatchUpdateManyWithWhereWithoutPlayer2Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutPlayer2Input>
  }

  export type MatchUpsertWithWhereUniqueWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutWinnerInput, MatchUncheckedUpdateWithoutWinnerInput>
    create: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutWinnerInput, MatchUncheckedUpdateWithoutWinnerInput>
  }

  export type MatchUpdateManyWithWhereWithoutWinnerInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutWinnerInput>
  }

  export type MatchUpsertWithWhereUniqueWithoutReporterInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutReporterInput, MatchUncheckedUpdateWithoutReporterInput>
    create: XOR<MatchCreateWithoutReporterInput, MatchUncheckedCreateWithoutReporterInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutReporterInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutReporterInput, MatchUncheckedUpdateWithoutReporterInput>
  }

  export type MatchUpdateManyWithWhereWithoutReporterInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutReporterInput>
  }

  export type MatchConfirmationUpsertWithWhereUniqueWithoutPlayerInput = {
    where: MatchConfirmationWhereUniqueInput
    update: XOR<MatchConfirmationUpdateWithoutPlayerInput, MatchConfirmationUncheckedUpdateWithoutPlayerInput>
    create: XOR<MatchConfirmationCreateWithoutPlayerInput, MatchConfirmationUncheckedCreateWithoutPlayerInput>
  }

  export type MatchConfirmationUpdateWithWhereUniqueWithoutPlayerInput = {
    where: MatchConfirmationWhereUniqueInput
    data: XOR<MatchConfirmationUpdateWithoutPlayerInput, MatchConfirmationUncheckedUpdateWithoutPlayerInput>
  }

  export type MatchConfirmationUpdateManyWithWhereWithoutPlayerInput = {
    where: MatchConfirmationScalarWhereInput
    data: XOR<MatchConfirmationUpdateManyMutationInput, MatchConfirmationUncheckedUpdateManyWithoutPlayerInput>
  }

  export type MatchConfirmationScalarWhereInput = {
    AND?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
    OR?: MatchConfirmationScalarWhereInput[]
    NOT?: MatchConfirmationScalarWhereInput | MatchConfirmationScalarWhereInput[]
    id?: StringFilter<"MatchConfirmation"> | string
    matchId?: StringFilter<"MatchConfirmation"> | string
    playerId?: StringFilter<"MatchConfirmation"> | string
    action?: StringFilter<"MatchConfirmation"> | string
    confirmedScore1?: IntNullableFilter<"MatchConfirmation"> | number | null
    confirmedScore2?: IntNullableFilter<"MatchConfirmation"> | number | null
    disputeReason?: StringNullableFilter<"MatchConfirmation"> | string | null
    createdAt?: DateTimeFilter<"MatchConfirmation"> | Date | string
  }

  export type RatingUpdateUpsertWithWhereUniqueWithoutPlayerInput = {
    where: RatingUpdateWhereUniqueInput
    update: XOR<RatingUpdateUpdateWithoutPlayerInput, RatingUpdateUncheckedUpdateWithoutPlayerInput>
    create: XOR<RatingUpdateCreateWithoutPlayerInput, RatingUpdateUncheckedCreateWithoutPlayerInput>
  }

  export type RatingUpdateUpdateWithWhereUniqueWithoutPlayerInput = {
    where: RatingUpdateWhereUniqueInput
    data: XOR<RatingUpdateUpdateWithoutPlayerInput, RatingUpdateUncheckedUpdateWithoutPlayerInput>
  }

  export type RatingUpdateUpdateManyWithWhereWithoutPlayerInput = {
    where: RatingUpdateScalarWhereInput
    data: XOR<RatingUpdateUpdateManyMutationInput, RatingUpdateUncheckedUpdateManyWithoutPlayerInput>
  }

  export type RatingUpdateScalarWhereInput = {
    AND?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
    OR?: RatingUpdateScalarWhereInput[]
    NOT?: RatingUpdateScalarWhereInput | RatingUpdateScalarWhereInput[]
    id?: StringFilter<"RatingUpdate"> | string
    matchId?: StringFilter<"RatingUpdate"> | string
    playerId?: StringFilter<"RatingUpdate"> | string
    leagueId?: StringFilter<"RatingUpdate"> | string
    oldRating?: IntFilter<"RatingUpdate"> | number
    newRating?: IntFilter<"RatingUpdate"> | number
    change?: IntFilter<"RatingUpdate"> | number
    createdAt?: DateTimeFilter<"RatingUpdate"> | Date | string
  }

  export type LeagueMembershipCreateWithoutLeagueInput = {
    id?: string
    joinedAt?: Date | string
    isActive?: boolean
    player: PlayerCreateNestedOneWithoutMembershipsInput
  }

  export type LeagueMembershipUncheckedCreateWithoutLeagueInput = {
    id?: string
    playerId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type LeagueMembershipCreateOrConnectWithoutLeagueInput = {
    where: LeagueMembershipWhereUniqueInput
    create: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput>
  }

  export type LeagueMembershipCreateManyLeagueInputEnvelope = {
    data: LeagueMembershipCreateManyLeagueInput | LeagueMembershipCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type PlayerRatingCreateWithoutLeagueInput = {
    id?: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
    player: PlayerCreateNestedOneWithoutRatingsInput
  }

  export type PlayerRatingUncheckedCreateWithoutLeagueInput = {
    id?: string
    playerId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type PlayerRatingCreateOrConnectWithoutLeagueInput = {
    where: PlayerRatingWhereUniqueInput
    create: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput>
  }

  export type PlayerRatingCreateManyLeagueInputEnvelope = {
    data: PlayerRatingCreateManyLeagueInput | PlayerRatingCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeCreateWithoutLeagueInput = {
    id?: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    challenger: PlayerCreateNestedOneWithoutChallengesSentInput
    challengee: PlayerCreateNestedOneWithoutChallengesReceivedInput
    match?: MatchCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeUncheckedCreateWithoutLeagueInput = {
    id?: string
    challengerId: string
    challengeeId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    match?: MatchUncheckedCreateNestedOneWithoutChallengeInput
  }

  export type ChallengeCreateOrConnectWithoutLeagueInput = {
    where: ChallengeWhereUniqueInput
    create: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput>
  }

  export type ChallengeCreateManyLeagueInputEnvelope = {
    data: ChallengeCreateManyLeagueInput | ChallengeCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type MatchCreateWithoutLeagueInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutLeagueInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutLeagueInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput>
  }

  export type MatchCreateManyLeagueInputEnvelope = {
    data: MatchCreateManyLeagueInput | MatchCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type RatingUpdateCreateWithoutLeagueInput = {
    id?: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
    match: MatchCreateNestedOneWithoutRatingUpdatesInput
    player: PlayerCreateNestedOneWithoutRatingUpdatesInput
  }

  export type RatingUpdateUncheckedCreateWithoutLeagueInput = {
    id?: string
    matchId: string
    playerId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type RatingUpdateCreateOrConnectWithoutLeagueInput = {
    where: RatingUpdateWhereUniqueInput
    create: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput>
  }

  export type RatingUpdateCreateManyLeagueInputEnvelope = {
    data: RatingUpdateCreateManyLeagueInput | RatingUpdateCreateManyLeagueInput[]
    skipDuplicates?: boolean
  }

  export type LeagueMembershipUpsertWithWhereUniqueWithoutLeagueInput = {
    where: LeagueMembershipWhereUniqueInput
    update: XOR<LeagueMembershipUpdateWithoutLeagueInput, LeagueMembershipUncheckedUpdateWithoutLeagueInput>
    create: XOR<LeagueMembershipCreateWithoutLeagueInput, LeagueMembershipUncheckedCreateWithoutLeagueInput>
  }

  export type LeagueMembershipUpdateWithWhereUniqueWithoutLeagueInput = {
    where: LeagueMembershipWhereUniqueInput
    data: XOR<LeagueMembershipUpdateWithoutLeagueInput, LeagueMembershipUncheckedUpdateWithoutLeagueInput>
  }

  export type LeagueMembershipUpdateManyWithWhereWithoutLeagueInput = {
    where: LeagueMembershipScalarWhereInput
    data: XOR<LeagueMembershipUpdateManyMutationInput, LeagueMembershipUncheckedUpdateManyWithoutLeagueInput>
  }

  export type PlayerRatingUpsertWithWhereUniqueWithoutLeagueInput = {
    where: PlayerRatingWhereUniqueInput
    update: XOR<PlayerRatingUpdateWithoutLeagueInput, PlayerRatingUncheckedUpdateWithoutLeagueInput>
    create: XOR<PlayerRatingCreateWithoutLeagueInput, PlayerRatingUncheckedCreateWithoutLeagueInput>
  }

  export type PlayerRatingUpdateWithWhereUniqueWithoutLeagueInput = {
    where: PlayerRatingWhereUniqueInput
    data: XOR<PlayerRatingUpdateWithoutLeagueInput, PlayerRatingUncheckedUpdateWithoutLeagueInput>
  }

  export type PlayerRatingUpdateManyWithWhereWithoutLeagueInput = {
    where: PlayerRatingScalarWhereInput
    data: XOR<PlayerRatingUpdateManyMutationInput, PlayerRatingUncheckedUpdateManyWithoutLeagueInput>
  }

  export type ChallengeUpsertWithWhereUniqueWithoutLeagueInput = {
    where: ChallengeWhereUniqueInput
    update: XOR<ChallengeUpdateWithoutLeagueInput, ChallengeUncheckedUpdateWithoutLeagueInput>
    create: XOR<ChallengeCreateWithoutLeagueInput, ChallengeUncheckedCreateWithoutLeagueInput>
  }

  export type ChallengeUpdateWithWhereUniqueWithoutLeagueInput = {
    where: ChallengeWhereUniqueInput
    data: XOR<ChallengeUpdateWithoutLeagueInput, ChallengeUncheckedUpdateWithoutLeagueInput>
  }

  export type ChallengeUpdateManyWithWhereWithoutLeagueInput = {
    where: ChallengeScalarWhereInput
    data: XOR<ChallengeUpdateManyMutationInput, ChallengeUncheckedUpdateManyWithoutLeagueInput>
  }

  export type MatchUpsertWithWhereUniqueWithoutLeagueInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutLeagueInput, MatchUncheckedUpdateWithoutLeagueInput>
    create: XOR<MatchCreateWithoutLeagueInput, MatchUncheckedCreateWithoutLeagueInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutLeagueInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutLeagueInput, MatchUncheckedUpdateWithoutLeagueInput>
  }

  export type MatchUpdateManyWithWhereWithoutLeagueInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutLeagueInput>
  }

  export type RatingUpdateUpsertWithWhereUniqueWithoutLeagueInput = {
    where: RatingUpdateWhereUniqueInput
    update: XOR<RatingUpdateUpdateWithoutLeagueInput, RatingUpdateUncheckedUpdateWithoutLeagueInput>
    create: XOR<RatingUpdateCreateWithoutLeagueInput, RatingUpdateUncheckedCreateWithoutLeagueInput>
  }

  export type RatingUpdateUpdateWithWhereUniqueWithoutLeagueInput = {
    where: RatingUpdateWhereUniqueInput
    data: XOR<RatingUpdateUpdateWithoutLeagueInput, RatingUpdateUncheckedUpdateWithoutLeagueInput>
  }

  export type RatingUpdateUpdateManyWithWhereWithoutLeagueInput = {
    where: RatingUpdateScalarWhereInput
    data: XOR<RatingUpdateUpdateManyMutationInput, RatingUpdateUncheckedUpdateManyWithoutLeagueInput>
  }

  export type PlayerCreateWithoutMembershipsInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMembershipsInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMembershipsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMembershipsInput, PlayerUncheckedCreateWithoutMembershipsInput>
  }

  export type LeagueCreateWithoutMembershipsInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    ratings?: PlayerRatingCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeCreateNestedManyWithoutLeagueInput
    matches?: MatchCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateWithoutMembershipsInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeUncheckedCreateNestedManyWithoutLeagueInput
    matches?: MatchUncheckedCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueCreateOrConnectWithoutMembershipsInput = {
    where: LeagueWhereUniqueInput
    create: XOR<LeagueCreateWithoutMembershipsInput, LeagueUncheckedCreateWithoutMembershipsInput>
  }

  export type PlayerUpsertWithoutMembershipsInput = {
    update: XOR<PlayerUpdateWithoutMembershipsInput, PlayerUncheckedUpdateWithoutMembershipsInput>
    create: XOR<PlayerCreateWithoutMembershipsInput, PlayerUncheckedCreateWithoutMembershipsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMembershipsInput, PlayerUncheckedUpdateWithoutMembershipsInput>
  }

  export type PlayerUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type LeagueUpsertWithoutMembershipsInput = {
    update: XOR<LeagueUpdateWithoutMembershipsInput, LeagueUncheckedUpdateWithoutMembershipsInput>
    create: XOR<LeagueCreateWithoutMembershipsInput, LeagueUncheckedCreateWithoutMembershipsInput>
    where?: LeagueWhereInput
  }

  export type LeagueUpdateToOneWithWhereWithoutMembershipsInput = {
    where?: LeagueWhereInput
    data: XOR<LeagueUpdateWithoutMembershipsInput, LeagueUncheckedUpdateWithoutMembershipsInput>
  }

  export type LeagueUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: PlayerRatingUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUpdateManyWithoutLeagueNestedInput
    matches?: MatchUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateWithoutMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ratings?: PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUncheckedUpdateManyWithoutLeagueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type PlayerCreateWithoutRatingsInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutRatingsInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutRatingsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutRatingsInput, PlayerUncheckedCreateWithoutRatingsInput>
  }

  export type LeagueCreateWithoutRatingsInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeCreateNestedManyWithoutLeagueInput
    matches?: MatchCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateWithoutRatingsInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeUncheckedCreateNestedManyWithoutLeagueInput
    matches?: MatchUncheckedCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueCreateOrConnectWithoutRatingsInput = {
    where: LeagueWhereUniqueInput
    create: XOR<LeagueCreateWithoutRatingsInput, LeagueUncheckedCreateWithoutRatingsInput>
  }

  export type PlayerUpsertWithoutRatingsInput = {
    update: XOR<PlayerUpdateWithoutRatingsInput, PlayerUncheckedUpdateWithoutRatingsInput>
    create: XOR<PlayerCreateWithoutRatingsInput, PlayerUncheckedCreateWithoutRatingsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutRatingsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutRatingsInput, PlayerUncheckedUpdateWithoutRatingsInput>
  }

  export type PlayerUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type LeagueUpsertWithoutRatingsInput = {
    update: XOR<LeagueUpdateWithoutRatingsInput, LeagueUncheckedUpdateWithoutRatingsInput>
    create: XOR<LeagueCreateWithoutRatingsInput, LeagueUncheckedCreateWithoutRatingsInput>
    where?: LeagueWhereInput
  }

  export type LeagueUpdateToOneWithWhereWithoutRatingsInput = {
    where?: LeagueWhereInput
    data: XOR<LeagueUpdateWithoutRatingsInput, LeagueUncheckedUpdateWithoutRatingsInput>
  }

  export type LeagueUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUpdateManyWithoutLeagueNestedInput
    matches?: MatchUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateWithoutRatingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUncheckedUpdateManyWithoutLeagueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type PlayerCreateWithoutChallengesSentInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutChallengesSentInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutChallengesSentInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutChallengesSentInput, PlayerUncheckedCreateWithoutChallengesSentInput>
  }

  export type PlayerCreateWithoutChallengesReceivedInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutChallengesReceivedInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutChallengesReceivedInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutChallengesReceivedInput, PlayerUncheckedCreateWithoutChallengesReceivedInput>
  }

  export type LeagueCreateWithoutChallengesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingCreateNestedManyWithoutLeagueInput
    matches?: MatchCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateWithoutChallengesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput
    matches?: MatchUncheckedCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueCreateOrConnectWithoutChallengesInput = {
    where: LeagueWhereUniqueInput
    create: XOR<LeagueCreateWithoutChallengesInput, LeagueUncheckedCreateWithoutChallengesInput>
  }

  export type MatchCreateWithoutChallengeInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutChallengeInput = {
    id?: string
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutChallengeInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
  }

  export type PlayerUpsertWithoutChallengesSentInput = {
    update: XOR<PlayerUpdateWithoutChallengesSentInput, PlayerUncheckedUpdateWithoutChallengesSentInput>
    create: XOR<PlayerCreateWithoutChallengesSentInput, PlayerUncheckedCreateWithoutChallengesSentInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutChallengesSentInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutChallengesSentInput, PlayerUncheckedUpdateWithoutChallengesSentInput>
  }

  export type PlayerUpdateWithoutChallengesSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutChallengesSentInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUpsertWithoutChallengesReceivedInput = {
    update: XOR<PlayerUpdateWithoutChallengesReceivedInput, PlayerUncheckedUpdateWithoutChallengesReceivedInput>
    create: XOR<PlayerCreateWithoutChallengesReceivedInput, PlayerUncheckedCreateWithoutChallengesReceivedInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutChallengesReceivedInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutChallengesReceivedInput, PlayerUncheckedUpdateWithoutChallengesReceivedInput>
  }

  export type PlayerUpdateWithoutChallengesReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutChallengesReceivedInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type LeagueUpsertWithoutChallengesInput = {
    update: XOR<LeagueUpdateWithoutChallengesInput, LeagueUncheckedUpdateWithoutChallengesInput>
    create: XOR<LeagueCreateWithoutChallengesInput, LeagueUncheckedCreateWithoutChallengesInput>
    where?: LeagueWhereInput
  }

  export type LeagueUpdateToOneWithWhereWithoutChallengesInput = {
    where?: LeagueWhereInput
    data: XOR<LeagueUpdateWithoutChallengesInput, LeagueUncheckedUpdateWithoutChallengesInput>
  }

  export type LeagueUpdateWithoutChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUpdateManyWithoutLeagueNestedInput
    matches?: MatchUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateWithoutChallengesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type MatchUpsertWithoutChallengeInput = {
    update: XOR<MatchUpdateWithoutChallengeInput, MatchUncheckedUpdateWithoutChallengeInput>
    create: XOR<MatchCreateWithoutChallengeInput, MatchUncheckedCreateWithoutChallengeInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutChallengeInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutChallengeInput, MatchUncheckedUpdateWithoutChallengeInput>
  }

  export type MatchUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type ChallengeCreateWithoutMatchInput = {
    id?: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    challenger: PlayerCreateNestedOneWithoutChallengesSentInput
    challengee: PlayerCreateNestedOneWithoutChallengesReceivedInput
    league: LeagueCreateNestedOneWithoutChallengesInput
  }

  export type ChallengeUncheckedCreateWithoutMatchInput = {
    id?: string
    challengerId: string
    challengeeId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ChallengeCreateOrConnectWithoutMatchInput = {
    where: ChallengeWhereUniqueInput
    create: XOR<ChallengeCreateWithoutMatchInput, ChallengeUncheckedCreateWithoutMatchInput>
  }

  export type PlayerCreateWithoutMatchesAsPlayer1Input = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMatchesAsPlayer1Input = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMatchesAsPlayer1Input = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMatchesAsPlayer1Input, PlayerUncheckedCreateWithoutMatchesAsPlayer1Input>
  }

  export type PlayerCreateWithoutMatchesAsPlayer2Input = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMatchesAsPlayer2Input = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMatchesAsPlayer2Input = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMatchesAsPlayer2Input, PlayerUncheckedCreateWithoutMatchesAsPlayer2Input>
  }

  export type PlayerCreateWithoutMatchesWonInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMatchesWonInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMatchesWonInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMatchesWonInput, PlayerUncheckedCreateWithoutMatchesWonInput>
  }

  export type PlayerCreateWithoutMatchesReportedInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMatchesReportedInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMatchesReportedInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMatchesReportedInput, PlayerUncheckedCreateWithoutMatchesReportedInput>
  }

  export type LeagueCreateWithoutMatchesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateWithoutMatchesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeUncheckedCreateNestedManyWithoutLeagueInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueCreateOrConnectWithoutMatchesInput = {
    where: LeagueWhereUniqueInput
    create: XOR<LeagueCreateWithoutMatchesInput, LeagueUncheckedCreateWithoutMatchesInput>
  }

  export type MatchConfirmationCreateWithoutMatchInput = {
    id?: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
    player: PlayerCreateNestedOneWithoutMatchConfirmationsInput
  }

  export type MatchConfirmationUncheckedCreateWithoutMatchInput = {
    id?: string
    playerId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type MatchConfirmationCreateOrConnectWithoutMatchInput = {
    where: MatchConfirmationWhereUniqueInput
    create: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput>
  }

  export type MatchConfirmationCreateManyMatchInputEnvelope = {
    data: MatchConfirmationCreateManyMatchInput | MatchConfirmationCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type RatingUpdateCreateWithoutMatchInput = {
    id?: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
    player: PlayerCreateNestedOneWithoutRatingUpdatesInput
    league: LeagueCreateNestedOneWithoutRatingUpdatesInput
  }

  export type RatingUpdateUncheckedCreateWithoutMatchInput = {
    id?: string
    playerId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type RatingUpdateCreateOrConnectWithoutMatchInput = {
    where: RatingUpdateWhereUniqueInput
    create: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput>
  }

  export type RatingUpdateCreateManyMatchInputEnvelope = {
    data: RatingUpdateCreateManyMatchInput | RatingUpdateCreateManyMatchInput[]
    skipDuplicates?: boolean
  }

  export type ChallengeUpsertWithoutMatchInput = {
    update: XOR<ChallengeUpdateWithoutMatchInput, ChallengeUncheckedUpdateWithoutMatchInput>
    create: XOR<ChallengeCreateWithoutMatchInput, ChallengeUncheckedCreateWithoutMatchInput>
    where?: ChallengeWhereInput
  }

  export type ChallengeUpdateToOneWithWhereWithoutMatchInput = {
    where?: ChallengeWhereInput
    data: XOR<ChallengeUpdateWithoutMatchInput, ChallengeUncheckedUpdateWithoutMatchInput>
  }

  export type ChallengeUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenger?: PlayerUpdateOneRequiredWithoutChallengesSentNestedInput
    challengee?: PlayerUpdateOneRequiredWithoutChallengesReceivedNestedInput
    league?: LeagueUpdateOneRequiredWithoutChallengesNestedInput
  }

  export type ChallengeUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PlayerUpsertWithoutMatchesAsPlayer1Input = {
    update: XOR<PlayerUpdateWithoutMatchesAsPlayer1Input, PlayerUncheckedUpdateWithoutMatchesAsPlayer1Input>
    create: XOR<PlayerCreateWithoutMatchesAsPlayer1Input, PlayerUncheckedCreateWithoutMatchesAsPlayer1Input>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMatchesAsPlayer1Input = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMatchesAsPlayer1Input, PlayerUncheckedUpdateWithoutMatchesAsPlayer1Input>
  }

  export type PlayerUpdateWithoutMatchesAsPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMatchesAsPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUpsertWithoutMatchesAsPlayer2Input = {
    update: XOR<PlayerUpdateWithoutMatchesAsPlayer2Input, PlayerUncheckedUpdateWithoutMatchesAsPlayer2Input>
    create: XOR<PlayerCreateWithoutMatchesAsPlayer2Input, PlayerUncheckedCreateWithoutMatchesAsPlayer2Input>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMatchesAsPlayer2Input = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMatchesAsPlayer2Input, PlayerUncheckedUpdateWithoutMatchesAsPlayer2Input>
  }

  export type PlayerUpdateWithoutMatchesAsPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMatchesAsPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUpsertWithoutMatchesWonInput = {
    update: XOR<PlayerUpdateWithoutMatchesWonInput, PlayerUncheckedUpdateWithoutMatchesWonInput>
    create: XOR<PlayerCreateWithoutMatchesWonInput, PlayerUncheckedCreateWithoutMatchesWonInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMatchesWonInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMatchesWonInput, PlayerUncheckedUpdateWithoutMatchesWonInput>
  }

  export type PlayerUpdateWithoutMatchesWonInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMatchesWonInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUpsertWithoutMatchesReportedInput = {
    update: XOR<PlayerUpdateWithoutMatchesReportedInput, PlayerUncheckedUpdateWithoutMatchesReportedInput>
    create: XOR<PlayerCreateWithoutMatchesReportedInput, PlayerUncheckedCreateWithoutMatchesReportedInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMatchesReportedInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMatchesReportedInput, PlayerUncheckedUpdateWithoutMatchesReportedInput>
  }

  export type PlayerUpdateWithoutMatchesReportedInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMatchesReportedInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type LeagueUpsertWithoutMatchesInput = {
    update: XOR<LeagueUpdateWithoutMatchesInput, LeagueUncheckedUpdateWithoutMatchesInput>
    create: XOR<LeagueCreateWithoutMatchesInput, LeagueUncheckedCreateWithoutMatchesInput>
    where?: LeagueWhereInput
  }

  export type LeagueUpdateToOneWithWhereWithoutMatchesInput = {
    where?: LeagueWhereInput
    data: XOR<LeagueUpdateWithoutMatchesInput, LeagueUncheckedUpdateWithoutMatchesInput>
  }

  export type LeagueUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateWithoutMatchesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUncheckedUpdateManyWithoutLeagueNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type MatchConfirmationUpsertWithWhereUniqueWithoutMatchInput = {
    where: MatchConfirmationWhereUniqueInput
    update: XOR<MatchConfirmationUpdateWithoutMatchInput, MatchConfirmationUncheckedUpdateWithoutMatchInput>
    create: XOR<MatchConfirmationCreateWithoutMatchInput, MatchConfirmationUncheckedCreateWithoutMatchInput>
  }

  export type MatchConfirmationUpdateWithWhereUniqueWithoutMatchInput = {
    where: MatchConfirmationWhereUniqueInput
    data: XOR<MatchConfirmationUpdateWithoutMatchInput, MatchConfirmationUncheckedUpdateWithoutMatchInput>
  }

  export type MatchConfirmationUpdateManyWithWhereWithoutMatchInput = {
    where: MatchConfirmationScalarWhereInput
    data: XOR<MatchConfirmationUpdateManyMutationInput, MatchConfirmationUncheckedUpdateManyWithoutMatchInput>
  }

  export type RatingUpdateUpsertWithWhereUniqueWithoutMatchInput = {
    where: RatingUpdateWhereUniqueInput
    update: XOR<RatingUpdateUpdateWithoutMatchInput, RatingUpdateUncheckedUpdateWithoutMatchInput>
    create: XOR<RatingUpdateCreateWithoutMatchInput, RatingUpdateUncheckedCreateWithoutMatchInput>
  }

  export type RatingUpdateUpdateWithWhereUniqueWithoutMatchInput = {
    where: RatingUpdateWhereUniqueInput
    data: XOR<RatingUpdateUpdateWithoutMatchInput, RatingUpdateUncheckedUpdateWithoutMatchInput>
  }

  export type RatingUpdateUpdateManyWithWhereWithoutMatchInput = {
    where: RatingUpdateScalarWhereInput
    data: XOR<RatingUpdateUpdateManyMutationInput, RatingUpdateUncheckedUpdateManyWithoutMatchInput>
  }

  export type MatchCreateWithoutConfirmationsInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutConfirmationsInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutConfirmationsInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutConfirmationsInput, MatchUncheckedCreateWithoutConfirmationsInput>
  }

  export type PlayerCreateWithoutMatchConfirmationsInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    ratingUpdates?: RatingUpdateCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutMatchConfirmationsInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    ratingUpdates?: RatingUpdateUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutMatchConfirmationsInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutMatchConfirmationsInput, PlayerUncheckedCreateWithoutMatchConfirmationsInput>
  }

  export type MatchUpsertWithoutConfirmationsInput = {
    update: XOR<MatchUpdateWithoutConfirmationsInput, MatchUncheckedUpdateWithoutConfirmationsInput>
    create: XOR<MatchCreateWithoutConfirmationsInput, MatchUncheckedCreateWithoutConfirmationsInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutConfirmationsInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutConfirmationsInput, MatchUncheckedUpdateWithoutConfirmationsInput>
  }

  export type MatchUpdateWithoutConfirmationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutConfirmationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type PlayerUpsertWithoutMatchConfirmationsInput = {
    update: XOR<PlayerUpdateWithoutMatchConfirmationsInput, PlayerUncheckedUpdateWithoutMatchConfirmationsInput>
    create: XOR<PlayerCreateWithoutMatchConfirmationsInput, PlayerUncheckedCreateWithoutMatchConfirmationsInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutMatchConfirmationsInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutMatchConfirmationsInput, PlayerUncheckedUpdateWithoutMatchConfirmationsInput>
  }

  export type PlayerUpdateWithoutMatchConfirmationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutMatchConfirmationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type MatchCreateWithoutRatingUpdatesInput = {
    id?: string
    player1Score: number
    player2Score: number
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    challenge?: ChallengeCreateNestedOneWithoutMatchInput
    player1: PlayerCreateNestedOneWithoutMatchesAsPlayer1Input
    player2: PlayerCreateNestedOneWithoutMatchesAsPlayer2Input
    winner?: PlayerCreateNestedOneWithoutMatchesWonInput
    reporter?: PlayerCreateNestedOneWithoutMatchesReportedInput
    league: LeagueCreateNestedOneWithoutMatchesInput
    confirmations?: MatchConfirmationCreateNestedManyWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutRatingUpdatesInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
    confirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutMatchInput
  }

  export type MatchCreateOrConnectWithoutRatingUpdatesInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutRatingUpdatesInput, MatchUncheckedCreateWithoutRatingUpdatesInput>
  }

  export type PlayerCreateWithoutRatingUpdatesInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPlayersInput
    memberships?: LeagueMembershipCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationCreateNestedManyWithoutPlayerInput
  }

  export type PlayerUncheckedCreateWithoutRatingUpdatesInput = {
    id?: string
    userId: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutPlayerInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutPlayerInput
    challengesSent?: ChallengeUncheckedCreateNestedManyWithoutChallengerInput
    challengesReceived?: ChallengeUncheckedCreateNestedManyWithoutChallengeeInput
    matchesAsPlayer1?: MatchUncheckedCreateNestedManyWithoutPlayer1Input
    matchesAsPlayer2?: MatchUncheckedCreateNestedManyWithoutPlayer2Input
    matchesWon?: MatchUncheckedCreateNestedManyWithoutWinnerInput
    matchesReported?: MatchUncheckedCreateNestedManyWithoutReporterInput
    matchConfirmations?: MatchConfirmationUncheckedCreateNestedManyWithoutPlayerInput
  }

  export type PlayerCreateOrConnectWithoutRatingUpdatesInput = {
    where: PlayerWhereUniqueInput
    create: XOR<PlayerCreateWithoutRatingUpdatesInput, PlayerUncheckedCreateWithoutRatingUpdatesInput>
  }

  export type LeagueCreateWithoutRatingUpdatesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeCreateNestedManyWithoutLeagueInput
    matches?: MatchCreateNestedManyWithoutLeagueInput
  }

  export type LeagueUncheckedCreateWithoutRatingUpdatesInput = {
    id: string
    name: string
    gameType: string
    createdAt?: Date | string
    memberships?: LeagueMembershipUncheckedCreateNestedManyWithoutLeagueInput
    ratings?: PlayerRatingUncheckedCreateNestedManyWithoutLeagueInput
    challenges?: ChallengeUncheckedCreateNestedManyWithoutLeagueInput
    matches?: MatchUncheckedCreateNestedManyWithoutLeagueInput
  }

  export type LeagueCreateOrConnectWithoutRatingUpdatesInput = {
    where: LeagueWhereUniqueInput
    create: XOR<LeagueCreateWithoutRatingUpdatesInput, LeagueUncheckedCreateWithoutRatingUpdatesInput>
  }

  export type MatchUpsertWithoutRatingUpdatesInput = {
    update: XOR<MatchUpdateWithoutRatingUpdatesInput, MatchUncheckedUpdateWithoutRatingUpdatesInput>
    create: XOR<MatchCreateWithoutRatingUpdatesInput, MatchUncheckedCreateWithoutRatingUpdatesInput>
    where?: MatchWhereInput
  }

  export type MatchUpdateToOneWithWhereWithoutRatingUpdatesInput = {
    where?: MatchWhereInput
    data: XOR<MatchUpdateWithoutRatingUpdatesInput, MatchUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type MatchUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type PlayerUpsertWithoutRatingUpdatesInput = {
    update: XOR<PlayerUpdateWithoutRatingUpdatesInput, PlayerUncheckedUpdateWithoutRatingUpdatesInput>
    create: XOR<PlayerCreateWithoutRatingUpdatesInput, PlayerUncheckedCreateWithoutRatingUpdatesInput>
    where?: PlayerWhereInput
  }

  export type PlayerUpdateToOneWithWhereWithoutRatingUpdatesInput = {
    where?: PlayerWhereInput
    data: XOR<PlayerUpdateWithoutRatingUpdatesInput, PlayerUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type PlayerUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPlayersNestedInput
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type LeagueUpsertWithoutRatingUpdatesInput = {
    update: XOR<LeagueUpdateWithoutRatingUpdatesInput, LeagueUncheckedUpdateWithoutRatingUpdatesInput>
    create: XOR<LeagueCreateWithoutRatingUpdatesInput, LeagueUncheckedCreateWithoutRatingUpdatesInput>
    where?: LeagueWhereInput
  }

  export type LeagueUpdateToOneWithWhereWithoutRatingUpdatesInput = {
    where?: LeagueWhereInput
    data: XOR<LeagueUpdateWithoutRatingUpdatesInput, LeagueUncheckedUpdateWithoutRatingUpdatesInput>
  }

  export type LeagueUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUpdateManyWithoutLeagueNestedInput
    matches?: MatchUpdateManyWithoutLeagueNestedInput
  }

  export type LeagueUncheckedUpdateWithoutRatingUpdatesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gameType?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutLeagueNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutLeagueNestedInput
    challenges?: ChallengeUncheckedUpdateManyWithoutLeagueNestedInput
    matches?: MatchUncheckedUpdateManyWithoutLeagueNestedInput
  }

  export type UserCreateWithoutAdminActionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    players?: PlayerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdminActionsInput = {
    id?: string
    name?: string | null
    email: string
    emailVerified?: Date | string | null
    image?: string | null
    isAdmin?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    players?: PlayerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdminActionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdminActionsInput, UserUncheckedCreateWithoutAdminActionsInput>
  }

  export type UserUpsertWithoutAdminActionsInput = {
    update: XOR<UserUpdateWithoutAdminActionsInput, UserUncheckedUpdateWithoutAdminActionsInput>
    create: XOR<UserCreateWithoutAdminActionsInput, UserUncheckedCreateWithoutAdminActionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdminActionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdminActionsInput, UserUncheckedUpdateWithoutAdminActionsInput>
  }

  export type UserUpdateWithoutAdminActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    players?: PlayerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdminActionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: StringFieldUpdateOperationsInput | string
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    players?: PlayerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type PlayerCreateManyUserInput = {
    id?: string
    name: string
    email?: string | null
    avatar?: string | null
    createdAt?: Date | string
  }

  export type AdminActionCreateManyUserInput = {
    id?: string
    action: string
    targetId?: string | null
    details?: string | null
    createdAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    memberships?: LeagueMembershipUncheckedUpdateManyWithoutPlayerNestedInput
    ratings?: PlayerRatingUncheckedUpdateManyWithoutPlayerNestedInput
    challengesSent?: ChallengeUncheckedUpdateManyWithoutChallengerNestedInput
    challengesReceived?: ChallengeUncheckedUpdateManyWithoutChallengeeNestedInput
    matchesAsPlayer1?: MatchUncheckedUpdateManyWithoutPlayer1NestedInput
    matchesAsPlayer2?: MatchUncheckedUpdateManyWithoutPlayer2NestedInput
    matchesWon?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
    matchesReported?: MatchUncheckedUpdateManyWithoutReporterNestedInput
    matchConfirmations?: MatchConfirmationUncheckedUpdateManyWithoutPlayerNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutPlayerNestedInput
  }

  export type PlayerUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminActionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeagueMembershipCreateManyPlayerInput = {
    id?: string
    leagueId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type PlayerRatingCreateManyPlayerInput = {
    id?: string
    leagueId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type ChallengeCreateManyChallengerInput = {
    id?: string
    challengeeId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type ChallengeCreateManyChallengeeInput = {
    id?: string
    challengerId: string
    leagueId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type MatchCreateManyPlayer1Input = {
    id?: string
    challengeId?: string | null
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type MatchCreateManyPlayer2Input = {
    id?: string
    challengeId?: string | null
    player1Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type MatchCreateManyWinnerInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type MatchCreateManyReporterInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    leagueId: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type MatchConfirmationCreateManyPlayerInput = {
    id?: string
    matchId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateCreateManyPlayerInput = {
    id?: string
    matchId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type LeagueMembershipUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    league?: LeagueUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type LeagueMembershipUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LeagueMembershipUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlayerRatingUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    league?: LeagueUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type PlayerRatingUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRatingUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeUpdateWithoutChallengerInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challengee?: PlayerUpdateOneRequiredWithoutChallengesReceivedNestedInput
    league?: LeagueUpdateOneRequiredWithoutChallengesNestedInput
    match?: MatchUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateWithoutChallengerInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    match?: MatchUncheckedUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateManyWithoutChallengerInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChallengeUpdateWithoutChallengeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenger?: PlayerUpdateOneRequiredWithoutChallengesSentNestedInput
    league?: LeagueUpdateOneRequiredWithoutChallengesNestedInput
    match?: MatchUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateWithoutChallengeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    match?: MatchUncheckedUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateManyWithoutChallengeeInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUpdateWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutPlayer1Input = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUpdateWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutPlayer2Input = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    league?: LeagueUpdateOneRequiredWithoutMatchesNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutReporterInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchConfirmationUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutConfirmationsNestedInput
  }

  export type MatchConfirmationUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchConfirmationUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutRatingUpdatesNestedInput
    league?: LeagueUpdateOneRequiredWithoutRatingUpdatesNestedInput
  }

  export type RatingUpdateUncheckedUpdateWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUncheckedUpdateManyWithoutPlayerInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeagueMembershipCreateManyLeagueInput = {
    id?: string
    playerId: string
    joinedAt?: Date | string
    isActive?: boolean
  }

  export type PlayerRatingCreateManyLeagueInput = {
    id?: string
    playerId: string
    rating?: number
    gamesPlayed?: number
    wins?: number
    losses?: number
    draws?: number
    updatedAt?: Date | string
  }

  export type ChallengeCreateManyLeagueInput = {
    id?: string
    challengerId: string
    challengeeId: string
    status?: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
  }

  export type MatchCreateManyLeagueInput = {
    id?: string
    challengeId?: string | null
    player1Id: string
    player2Id: string
    player1Score: number
    player2Score: number
    winnerId?: string | null
    status?: string
    reportedBy?: string | null
    playedAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type RatingUpdateCreateManyLeagueInput = {
    id?: string
    matchId: string
    playerId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type LeagueMembershipUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    player?: PlayerUpdateOneRequiredWithoutMembershipsNestedInput
  }

  export type LeagueMembershipUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type LeagueMembershipUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlayerRatingUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutRatingsNestedInput
  }

  export type PlayerRatingUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PlayerRatingUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    rating?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    wins?: IntFieldUpdateOperationsInput | number
    losses?: IntFieldUpdateOperationsInput | number
    draws?: IntFieldUpdateOperationsInput | number
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChallengeUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenger?: PlayerUpdateOneRequiredWithoutChallengesSentNestedInput
    challengee?: PlayerUpdateOneRequiredWithoutChallengesReceivedNestedInput
    match?: MatchUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    match?: MatchUncheckedUpdateOneWithoutChallengeNestedInput
  }

  export type ChallengeUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengerId?: StringFieldUpdateOperationsInput | string
    challengeeId?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type MatchUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    challenge?: ChallengeUpdateOneWithoutMatchNestedInput
    player1?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer1NestedInput
    player2?: PlayerUpdateOneRequiredWithoutMatchesAsPlayer2NestedInput
    winner?: PlayerUpdateOneWithoutMatchesWonNestedInput
    reporter?: PlayerUpdateOneWithoutMatchesReportedNestedInput
    confirmations?: MatchConfirmationUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    confirmations?: MatchConfirmationUncheckedUpdateManyWithoutMatchNestedInput
    ratingUpdates?: RatingUpdateUncheckedUpdateManyWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: NullableStringFieldUpdateOperationsInput | string | null
    player1Id?: StringFieldUpdateOperationsInput | string
    player2Id?: StringFieldUpdateOperationsInput | string
    player1Score?: IntFieldUpdateOperationsInput | number
    player2Score?: IntFieldUpdateOperationsInput | number
    winnerId?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    reportedBy?: NullableStringFieldUpdateOperationsInput | string | null
    playedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type RatingUpdateUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    match?: MatchUpdateOneRequiredWithoutRatingUpdatesNestedInput
    player?: PlayerUpdateOneRequiredWithoutRatingUpdatesNestedInput
  }

  export type RatingUpdateUncheckedUpdateWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUncheckedUpdateManyWithoutLeagueInput = {
    id?: StringFieldUpdateOperationsInput | string
    matchId?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchConfirmationCreateManyMatchInput = {
    id?: string
    playerId: string
    action: string
    confirmedScore1?: number | null
    confirmedScore2?: number | null
    disputeReason?: string | null
    createdAt?: Date | string
  }

  export type RatingUpdateCreateManyMatchInput = {
    id?: string
    playerId: string
    leagueId: string
    oldRating: number
    newRating: number
    change: number
    createdAt?: Date | string
  }

  export type MatchConfirmationUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutMatchConfirmationsNestedInput
  }

  export type MatchConfirmationUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MatchConfirmationUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    confirmedScore1?: NullableIntFieldUpdateOperationsInput | number | null
    confirmedScore2?: NullableIntFieldUpdateOperationsInput | number | null
    disputeReason?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    player?: PlayerUpdateOneRequiredWithoutRatingUpdatesNestedInput
    league?: LeagueUpdateOneRequiredWithoutRatingUpdatesNestedInput
  }

  export type RatingUpdateUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RatingUpdateUncheckedUpdateManyWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerId?: StringFieldUpdateOperationsInput | string
    leagueId?: StringFieldUpdateOperationsInput | string
    oldRating?: IntFieldUpdateOperationsInput | number
    newRating?: IntFieldUpdateOperationsInput | number
    change?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}