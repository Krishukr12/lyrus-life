
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
 * Model Meeting
 * 
 */
export type Meeting = $Result.DefaultSelection<Prisma.$MeetingPayload>
/**
 * Model MeetingInvite
 * 
 */
export type MeetingInvite = $Result.DefaultSelection<Prisma.$MeetingInvitePayload>
/**
 * Model MeetingParticipant
 * 
 */
export type MeetingParticipant = $Result.DefaultSelection<Prisma.$MeetingParticipantPayload>
/**
 * Model AudioFile
 * 
 */
export type AudioFile = $Result.DefaultSelection<Prisma.$AudioFilePayload>
/**
 * Model Transcript
 * 
 */
export type Transcript = $Result.DefaultSelection<Prisma.$TranscriptPayload>
/**
 * Model TranscriptSegment
 * 
 */
export type TranscriptSegment = $Result.DefaultSelection<Prisma.$TranscriptSegmentPayload>
/**
 * Model Mom
 * 
 */
export type Mom = $Result.DefaultSelection<Prisma.$MomPayload>
/**
 * Model ActionItem
 * 
 */
export type ActionItem = $Result.DefaultSelection<Prisma.$ActionItemPayload>
/**
 * Model Decision
 * 
 */
export type Decision = $Result.DefaultSelection<Prisma.$DecisionPayload>
/**
 * Model Summary
 * 
 */
export type Summary = $Result.DefaultSelection<Prisma.$SummaryPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const MeetingStatus: {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED'
};

export type MeetingStatus = (typeof MeetingStatus)[keyof typeof MeetingStatus]


export const MeetingTag: {
  INTERNAL: 'INTERNAL',
  CLIENT: 'CLIENT',
  VENDOR: 'VENDOR'
};

export type MeetingTag = (typeof MeetingTag)[keyof typeof MeetingTag]


export const TaskStatus: {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]


export const TaskPriority: {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  UNSPECIFIED: 'UNSPECIFIED'
};

export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority]


export const PipelineStep: {
  AUDIO_UPLOADED: 'AUDIO_UPLOADED',
  TRANSCRIPTION_STARTED: 'TRANSCRIPTION_STARTED',
  TRANSCRIPTION_COMPLETED: 'TRANSCRIPTION_COMPLETED',
  NLU_STARTED: 'NLU_STARTED',
  NLU_COMPLETED: 'NLU_COMPLETED',
  MOM_GENERATED: 'MOM_GENERATED',
  TASKS_CREATED: 'TASKS_CREATED',
  INVITES_SENT: 'INVITES_SENT',
  NOTIFICATION_SENT: 'NOTIFICATION_SENT',
  USER_EDIT: 'USER_EDIT',
  ERROR: 'ERROR'
};

export type PipelineStep = (typeof PipelineStep)[keyof typeof PipelineStep]


export const InviteStatus: {
  SENT: 'SENT',
  LOGGED: 'LOGGED',
  FAILED: 'FAILED'
};

export type InviteStatus = (typeof InviteStatus)[keyof typeof InviteStatus]

}

export type MeetingStatus = $Enums.MeetingStatus

export const MeetingStatus: typeof $Enums.MeetingStatus

export type MeetingTag = $Enums.MeetingTag

export const MeetingTag: typeof $Enums.MeetingTag

export type TaskStatus = $Enums.TaskStatus

export const TaskStatus: typeof $Enums.TaskStatus

export type TaskPriority = $Enums.TaskPriority

export const TaskPriority: typeof $Enums.TaskPriority

export type PipelineStep = $Enums.PipelineStep

export const PipelineStep: typeof $Enums.PipelineStep

export type InviteStatus = $Enums.InviteStatus

export const InviteStatus: typeof $Enums.InviteStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
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
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

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
   * `prisma.meeting`: Exposes CRUD operations for the **Meeting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Meetings
    * const meetings = await prisma.meeting.findMany()
    * ```
    */
  get meeting(): Prisma.MeetingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meetingInvite`: Exposes CRUD operations for the **MeetingInvite** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeetingInvites
    * const meetingInvites = await prisma.meetingInvite.findMany()
    * ```
    */
  get meetingInvite(): Prisma.MeetingInviteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meetingParticipant`: Exposes CRUD operations for the **MeetingParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeetingParticipants
    * const meetingParticipants = await prisma.meetingParticipant.findMany()
    * ```
    */
  get meetingParticipant(): Prisma.MeetingParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.audioFile`: Exposes CRUD operations for the **AudioFile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AudioFiles
    * const audioFiles = await prisma.audioFile.findMany()
    * ```
    */
  get audioFile(): Prisma.AudioFileDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcript`: Exposes CRUD operations for the **Transcript** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transcripts
    * const transcripts = await prisma.transcript.findMany()
    * ```
    */
  get transcript(): Prisma.TranscriptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transcriptSegment`: Exposes CRUD operations for the **TranscriptSegment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TranscriptSegments
    * const transcriptSegments = await prisma.transcriptSegment.findMany()
    * ```
    */
  get transcriptSegment(): Prisma.TranscriptSegmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mom`: Exposes CRUD operations for the **Mom** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Moms
    * const moms = await prisma.mom.findMany()
    * ```
    */
  get mom(): Prisma.MomDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.actionItem`: Exposes CRUD operations for the **ActionItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ActionItems
    * const actionItems = await prisma.actionItem.findMany()
    * ```
    */
  get actionItem(): Prisma.ActionItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.decision`: Exposes CRUD operations for the **Decision** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Decisions
    * const decisions = await prisma.decision.findMany()
    * ```
    */
  get decision(): Prisma.DecisionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.summary`: Exposes CRUD operations for the **Summary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Summaries
    * const summaries = await prisma.summary.findMany()
    * ```
    */
  get summary(): Prisma.SummaryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 7.8.0
   * Query Engine version: 3c6e192761c0362d496ed980de936e2f3cebcd3a
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
    Meeting: 'Meeting',
    MeetingInvite: 'MeetingInvite',
    MeetingParticipant: 'MeetingParticipant',
    AudioFile: 'AudioFile',
    Transcript: 'Transcript',
    TranscriptSegment: 'TranscriptSegment',
    Mom: 'Mom',
    ActionItem: 'ActionItem',
    Decision: 'Decision',
    Summary: 'Summary',
    AuditLog: 'AuditLog'
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
      modelProps: "user" | "meeting" | "meetingInvite" | "meetingParticipant" | "audioFile" | "transcript" | "transcriptSegment" | "mom" | "actionItem" | "decision" | "summary" | "auditLog"
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
      Meeting: {
        payload: Prisma.$MeetingPayload<ExtArgs>
        fields: Prisma.MeetingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          findFirst: {
            args: Prisma.MeetingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          findMany: {
            args: Prisma.MeetingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          create: {
            args: Prisma.MeetingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          createMany: {
            args: Prisma.MeetingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          delete: {
            args: Prisma.MeetingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          update: {
            args: Prisma.MeetingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          deleteMany: {
            args: Prisma.MeetingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>[]
          }
          upsert: {
            args: Prisma.MeetingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingPayload>
          }
          aggregate: {
            args: Prisma.MeetingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeeting>
          }
          groupBy: {
            args: Prisma.MeetingGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingCountAggregateOutputType> | number
          }
        }
      }
      MeetingInvite: {
        payload: Prisma.$MeetingInvitePayload<ExtArgs>
        fields: Prisma.MeetingInviteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingInviteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingInviteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          findFirst: {
            args: Prisma.MeetingInviteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingInviteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          findMany: {
            args: Prisma.MeetingInviteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>[]
          }
          create: {
            args: Prisma.MeetingInviteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          createMany: {
            args: Prisma.MeetingInviteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingInviteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>[]
          }
          delete: {
            args: Prisma.MeetingInviteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          update: {
            args: Prisma.MeetingInviteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          deleteMany: {
            args: Prisma.MeetingInviteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingInviteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingInviteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>[]
          }
          upsert: {
            args: Prisma.MeetingInviteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingInvitePayload>
          }
          aggregate: {
            args: Prisma.MeetingInviteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeetingInvite>
          }
          groupBy: {
            args: Prisma.MeetingInviteGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingInviteGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingInviteCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingInviteCountAggregateOutputType> | number
          }
        }
      }
      MeetingParticipant: {
        payload: Prisma.$MeetingParticipantPayload<ExtArgs>
        fields: Prisma.MeetingParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeetingParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeetingParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          findFirst: {
            args: Prisma.MeetingParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeetingParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          findMany: {
            args: Prisma.MeetingParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>[]
          }
          create: {
            args: Prisma.MeetingParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          createMany: {
            args: Prisma.MeetingParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeetingParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>[]
          }
          delete: {
            args: Prisma.MeetingParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          update: {
            args: Prisma.MeetingParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          deleteMany: {
            args: Prisma.MeetingParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeetingParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeetingParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>[]
          }
          upsert: {
            args: Prisma.MeetingParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeetingParticipantPayload>
          }
          aggregate: {
            args: Prisma.MeetingParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeetingParticipant>
          }
          groupBy: {
            args: Prisma.MeetingParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeetingParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeetingParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<MeetingParticipantCountAggregateOutputType> | number
          }
        }
      }
      AudioFile: {
        payload: Prisma.$AudioFilePayload<ExtArgs>
        fields: Prisma.AudioFileFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AudioFileFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AudioFileFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          findFirst: {
            args: Prisma.AudioFileFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AudioFileFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          findMany: {
            args: Prisma.AudioFileFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>[]
          }
          create: {
            args: Prisma.AudioFileCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          createMany: {
            args: Prisma.AudioFileCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AudioFileCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>[]
          }
          delete: {
            args: Prisma.AudioFileDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          update: {
            args: Prisma.AudioFileUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          deleteMany: {
            args: Prisma.AudioFileDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AudioFileUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AudioFileUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>[]
          }
          upsert: {
            args: Prisma.AudioFileUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AudioFilePayload>
          }
          aggregate: {
            args: Prisma.AudioFileAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAudioFile>
          }
          groupBy: {
            args: Prisma.AudioFileGroupByArgs<ExtArgs>
            result: $Utils.Optional<AudioFileGroupByOutputType>[]
          }
          count: {
            args: Prisma.AudioFileCountArgs<ExtArgs>
            result: $Utils.Optional<AudioFileCountAggregateOutputType> | number
          }
        }
      }
      Transcript: {
        payload: Prisma.$TranscriptPayload<ExtArgs>
        fields: Prisma.TranscriptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findFirst: {
            args: Prisma.TranscriptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          findMany: {
            args: Prisma.TranscriptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          create: {
            args: Prisma.TranscriptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          createMany: {
            args: Prisma.TranscriptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          delete: {
            args: Prisma.TranscriptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          update: {
            args: Prisma.TranscriptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptPayload>
          }
          aggregate: {
            args: Prisma.TranscriptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscript>
          }
          groupBy: {
            args: Prisma.TranscriptGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptCountAggregateOutputType> | number
          }
        }
      }
      TranscriptSegment: {
        payload: Prisma.$TranscriptSegmentPayload<ExtArgs>
        fields: Prisma.TranscriptSegmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptSegmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          findFirst: {
            args: Prisma.TranscriptSegmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptSegmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          findMany: {
            args: Prisma.TranscriptSegmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          create: {
            args: Prisma.TranscriptSegmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          createMany: {
            args: Prisma.TranscriptSegmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptSegmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          delete: {
            args: Prisma.TranscriptSegmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          update: {
            args: Prisma.TranscriptSegmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptSegmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptSegmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>[]
          }
          upsert: {
            args: Prisma.TranscriptSegmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptSegmentPayload>
          }
          aggregate: {
            args: Prisma.TranscriptSegmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscriptSegment>
          }
          groupBy: {
            args: Prisma.TranscriptSegmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptSegmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptSegmentCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptSegmentCountAggregateOutputType> | number
          }
        }
      }
      Mom: {
        payload: Prisma.$MomPayload<ExtArgs>
        fields: Prisma.MomFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MomFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MomFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          findFirst: {
            args: Prisma.MomFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MomFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          findMany: {
            args: Prisma.MomFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>[]
          }
          create: {
            args: Prisma.MomCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          createMany: {
            args: Prisma.MomCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MomCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>[]
          }
          delete: {
            args: Prisma.MomDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          update: {
            args: Prisma.MomUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          deleteMany: {
            args: Prisma.MomDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MomUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MomUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>[]
          }
          upsert: {
            args: Prisma.MomUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MomPayload>
          }
          aggregate: {
            args: Prisma.MomAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMom>
          }
          groupBy: {
            args: Prisma.MomGroupByArgs<ExtArgs>
            result: $Utils.Optional<MomGroupByOutputType>[]
          }
          count: {
            args: Prisma.MomCountArgs<ExtArgs>
            result: $Utils.Optional<MomCountAggregateOutputType> | number
          }
        }
      }
      ActionItem: {
        payload: Prisma.$ActionItemPayload<ExtArgs>
        fields: Prisma.ActionItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ActionItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ActionItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          findFirst: {
            args: Prisma.ActionItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ActionItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          findMany: {
            args: Prisma.ActionItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>[]
          }
          create: {
            args: Prisma.ActionItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          createMany: {
            args: Prisma.ActionItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ActionItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>[]
          }
          delete: {
            args: Prisma.ActionItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          update: {
            args: Prisma.ActionItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          deleteMany: {
            args: Prisma.ActionItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ActionItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ActionItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>[]
          }
          upsert: {
            args: Prisma.ActionItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ActionItemPayload>
          }
          aggregate: {
            args: Prisma.ActionItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateActionItem>
          }
          groupBy: {
            args: Prisma.ActionItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<ActionItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.ActionItemCountArgs<ExtArgs>
            result: $Utils.Optional<ActionItemCountAggregateOutputType> | number
          }
        }
      }
      Decision: {
        payload: Prisma.$DecisionPayload<ExtArgs>
        fields: Prisma.DecisionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DecisionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DecisionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          findFirst: {
            args: Prisma.DecisionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DecisionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          findMany: {
            args: Prisma.DecisionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>[]
          }
          create: {
            args: Prisma.DecisionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          createMany: {
            args: Prisma.DecisionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DecisionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>[]
          }
          delete: {
            args: Prisma.DecisionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          update: {
            args: Prisma.DecisionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          deleteMany: {
            args: Prisma.DecisionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DecisionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DecisionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>[]
          }
          upsert: {
            args: Prisma.DecisionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DecisionPayload>
          }
          aggregate: {
            args: Prisma.DecisionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDecision>
          }
          groupBy: {
            args: Prisma.DecisionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DecisionGroupByOutputType>[]
          }
          count: {
            args: Prisma.DecisionCountArgs<ExtArgs>
            result: $Utils.Optional<DecisionCountAggregateOutputType> | number
          }
        }
      }
      Summary: {
        payload: Prisma.$SummaryPayload<ExtArgs>
        fields: Prisma.SummaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SummaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SummaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          findFirst: {
            args: Prisma.SummaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SummaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          findMany: {
            args: Prisma.SummaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>[]
          }
          create: {
            args: Prisma.SummaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          createMany: {
            args: Prisma.SummaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SummaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>[]
          }
          delete: {
            args: Prisma.SummaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          update: {
            args: Prisma.SummaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          deleteMany: {
            args: Prisma.SummaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SummaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SummaryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>[]
          }
          upsert: {
            args: Prisma.SummaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SummaryPayload>
          }
          aggregate: {
            args: Prisma.SummaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSummary>
          }
          groupBy: {
            args: Prisma.SummaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SummaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SummaryCountArgs<ExtArgs>
            result: $Utils.Optional<SummaryCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
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
    meeting?: MeetingOmit
    meetingInvite?: MeetingInviteOmit
    meetingParticipant?: MeetingParticipantOmit
    audioFile?: AudioFileOmit
    transcript?: TranscriptOmit
    transcriptSegment?: TranscriptSegmentOmit
    mom?: MomOmit
    actionItem?: ActionItemOmit
    decision?: DecisionOmit
    summary?: SummaryOmit
    auditLog?: AuditLogOmit
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
    organizedMeetings: number
    ownedTasks: number
    auditLogs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizedMeetings?: boolean | UserCountOutputTypeCountOrganizedMeetingsArgs
    ownedTasks?: boolean | UserCountOutputTypeCountOwnedTasksArgs
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
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
  export type UserCountOutputTypeCountOrganizedMeetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountOwnedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionItemWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }


  /**
   * Count Type MeetingCountOutputType
   */

  export type MeetingCountOutputType = {
    participants: number
    audioFiles: number
    actionItems: number
    decisions: number
    auditLogs: number
    invites: number
  }

  export type MeetingCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | MeetingCountOutputTypeCountParticipantsArgs
    audioFiles?: boolean | MeetingCountOutputTypeCountAudioFilesArgs
    actionItems?: boolean | MeetingCountOutputTypeCountActionItemsArgs
    decisions?: boolean | MeetingCountOutputTypeCountDecisionsArgs
    auditLogs?: boolean | MeetingCountOutputTypeCountAuditLogsArgs
    invites?: boolean | MeetingCountOutputTypeCountInvitesArgs
  }

  // Custom InputTypes
  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingCountOutputType
     */
    select?: MeetingCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingParticipantWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountAudioFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AudioFileWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountActionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionItemWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountDecisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DecisionWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * MeetingCountOutputType without action
   */
  export type MeetingCountOutputTypeCountInvitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingInviteWhereInput
  }


  /**
   * Count Type TranscriptCountOutputType
   */

  export type TranscriptCountOutputType = {
    segments: number
  }

  export type TranscriptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    segments?: boolean | TranscriptCountOutputTypeCountSegmentsArgs
  }

  // Custom InputTypes
  /**
   * TranscriptCountOutputType without action
   */
  export type TranscriptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptCountOutputType
     */
    select?: TranscriptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TranscriptCountOutputType without action
   */
  export type TranscriptCountOutputTypeCountSegmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptSegmentWhereInput
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
    email: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
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
    email: string
    name: string
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
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizedMeetings?: boolean | User$organizedMeetingsArgs<ExtArgs>
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizedMeetings?: boolean | User$organizedMeetingsArgs<ExtArgs>
    ownedTasks?: boolean | User$ownedTasksArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organizedMeetings: Prisma.$MeetingPayload<ExtArgs>[]
      ownedTasks: Prisma.$ActionItemPayload<ExtArgs>[]
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
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
    organizedMeetings<T extends User$organizedMeetingsArgs<ExtArgs> = {}>(args?: Subset<T, User$organizedMeetingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ownedTasks<T extends User$ownedTasksArgs<ExtArgs> = {}>(args?: Subset<T, User$ownedTasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
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
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
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
   * User.organizedMeetings
   */
  export type User$organizedMeetingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    where?: MeetingWhereInput
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    cursor?: MeetingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * User.ownedTasks
   */
  export type User$ownedTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    where?: ActionItemWhereInput
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    cursor?: ActionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionItemScalarFieldEnum | ActionItemScalarFieldEnum[]
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
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
   * Model Meeting
   */

  export type AggregateMeeting = {
    _count: MeetingCountAggregateOutputType | null
    _avg: MeetingAvgAggregateOutputType | null
    _sum: MeetingSumAggregateOutputType | null
    _min: MeetingMinAggregateOutputType | null
    _max: MeetingMaxAggregateOutputType | null
  }

  export type MeetingAvgAggregateOutputType = {
    durationMinutes: number | null
  }

  export type MeetingSumAggregateOutputType = {
    durationMinutes: number | null
  }

  export type MeetingMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    scheduledAt: Date | null
    durationMinutes: number | null
    status: $Enums.MeetingStatus | null
    tag: $Enums.MeetingTag | null
    notes: string | null
    calendarEventId: string | null
    recordingUrl: string | null
    organizerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MeetingMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    scheduledAt: Date | null
    durationMinutes: number | null
    status: $Enums.MeetingStatus | null
    tag: $Enums.MeetingTag | null
    notes: string | null
    calendarEventId: string | null
    recordingUrl: string | null
    organizerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MeetingCountAggregateOutputType = {
    id: number
    title: number
    description: number
    scheduledAt: number
    durationMinutes: number
    status: number
    tag: number
    notes: number
    calendarEventId: number
    recordingUrl: number
    organizerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MeetingAvgAggregateInputType = {
    durationMinutes?: true
  }

  export type MeetingSumAggregateInputType = {
    durationMinutes?: true
  }

  export type MeetingMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    scheduledAt?: true
    durationMinutes?: true
    status?: true
    tag?: true
    notes?: true
    calendarEventId?: true
    recordingUrl?: true
    organizerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MeetingMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    scheduledAt?: true
    durationMinutes?: true
    status?: true
    tag?: true
    notes?: true
    calendarEventId?: true
    recordingUrl?: true
    organizerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MeetingCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    scheduledAt?: true
    durationMinutes?: true
    status?: true
    tag?: true
    notes?: true
    calendarEventId?: true
    recordingUrl?: true
    organizerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MeetingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Meeting to aggregate.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Meetings
    **/
    _count?: true | MeetingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MeetingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MeetingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingMaxAggregateInputType
  }

  export type GetMeetingAggregateType<T extends MeetingAggregateArgs> = {
        [P in keyof T & keyof AggregateMeeting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeeting[P]>
      : GetScalarType<T[P], AggregateMeeting[P]>
  }




  export type MeetingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingWhereInput
    orderBy?: MeetingOrderByWithAggregationInput | MeetingOrderByWithAggregationInput[]
    by: MeetingScalarFieldEnum[] | MeetingScalarFieldEnum
    having?: MeetingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingCountAggregateInputType | true
    _avg?: MeetingAvgAggregateInputType
    _sum?: MeetingSumAggregateInputType
    _min?: MeetingMinAggregateInputType
    _max?: MeetingMaxAggregateInputType
  }

  export type MeetingGroupByOutputType = {
    id: string
    title: string
    description: string
    scheduledAt: Date
    durationMinutes: number
    status: $Enums.MeetingStatus
    tag: $Enums.MeetingTag
    notes: string
    calendarEventId: string | null
    recordingUrl: string | null
    organizerId: string | null
    createdAt: Date
    updatedAt: Date
    _count: MeetingCountAggregateOutputType | null
    _avg: MeetingAvgAggregateOutputType | null
    _sum: MeetingSumAggregateOutputType | null
    _min: MeetingMinAggregateOutputType | null
    _max: MeetingMaxAggregateOutputType | null
  }

  type GetMeetingGroupByPayload<T extends MeetingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingGroupByOutputType[P]>
        }
      >
    >


  export type MeetingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    scheduledAt?: boolean
    durationMinutes?: boolean
    status?: boolean
    tag?: boolean
    notes?: boolean
    calendarEventId?: boolean
    recordingUrl?: boolean
    organizerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
    participants?: boolean | Meeting$participantsArgs<ExtArgs>
    audioFiles?: boolean | Meeting$audioFilesArgs<ExtArgs>
    transcript?: boolean | Meeting$transcriptArgs<ExtArgs>
    mom?: boolean | Meeting$momArgs<ExtArgs>
    actionItems?: boolean | Meeting$actionItemsArgs<ExtArgs>
    decisions?: boolean | Meeting$decisionsArgs<ExtArgs>
    summary?: boolean | Meeting$summaryArgs<ExtArgs>
    auditLogs?: boolean | Meeting$auditLogsArgs<ExtArgs>
    invites?: boolean | Meeting$invitesArgs<ExtArgs>
    _count?: boolean | MeetingCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    scheduledAt?: boolean
    durationMinutes?: boolean
    status?: boolean
    tag?: boolean
    notes?: boolean
    calendarEventId?: boolean
    recordingUrl?: boolean
    organizerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    scheduledAt?: boolean
    durationMinutes?: boolean
    status?: boolean
    tag?: boolean
    notes?: boolean
    calendarEventId?: boolean
    recordingUrl?: boolean
    organizerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
  }, ExtArgs["result"]["meeting"]>

  export type MeetingSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    scheduledAt?: boolean
    durationMinutes?: boolean
    status?: boolean
    tag?: boolean
    notes?: boolean
    calendarEventId?: boolean
    recordingUrl?: boolean
    organizerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MeetingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "scheduledAt" | "durationMinutes" | "status" | "tag" | "notes" | "calendarEventId" | "recordingUrl" | "organizerId" | "createdAt" | "updatedAt", ExtArgs["result"]["meeting"]>
  export type MeetingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
    participants?: boolean | Meeting$participantsArgs<ExtArgs>
    audioFiles?: boolean | Meeting$audioFilesArgs<ExtArgs>
    transcript?: boolean | Meeting$transcriptArgs<ExtArgs>
    mom?: boolean | Meeting$momArgs<ExtArgs>
    actionItems?: boolean | Meeting$actionItemsArgs<ExtArgs>
    decisions?: boolean | Meeting$decisionsArgs<ExtArgs>
    summary?: boolean | Meeting$summaryArgs<ExtArgs>
    auditLogs?: boolean | Meeting$auditLogsArgs<ExtArgs>
    invites?: boolean | Meeting$invitesArgs<ExtArgs>
    _count?: boolean | MeetingCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MeetingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
  }
  export type MeetingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organizer?: boolean | Meeting$organizerArgs<ExtArgs>
  }

  export type $MeetingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Meeting"
    objects: {
      organizer: Prisma.$UserPayload<ExtArgs> | null
      participants: Prisma.$MeetingParticipantPayload<ExtArgs>[]
      audioFiles: Prisma.$AudioFilePayload<ExtArgs>[]
      transcript: Prisma.$TranscriptPayload<ExtArgs> | null
      mom: Prisma.$MomPayload<ExtArgs> | null
      actionItems: Prisma.$ActionItemPayload<ExtArgs>[]
      decisions: Prisma.$DecisionPayload<ExtArgs>[]
      summary: Prisma.$SummaryPayload<ExtArgs> | null
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      invites: Prisma.$MeetingInvitePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      scheduledAt: Date
      durationMinutes: number
      status: $Enums.MeetingStatus
      tag: $Enums.MeetingTag
      notes: string
      calendarEventId: string | null
      recordingUrl: string | null
      organizerId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["meeting"]>
    composites: {}
  }

  type MeetingGetPayload<S extends boolean | null | undefined | MeetingDefaultArgs> = $Result.GetResult<Prisma.$MeetingPayload, S>

  type MeetingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingCountAggregateInputType | true
    }

  export interface MeetingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Meeting'], meta: { name: 'Meeting' } }
    /**
     * Find zero or one Meeting that matches the filter.
     * @param {MeetingFindUniqueArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingFindUniqueArgs>(args: SelectSubset<T, MeetingFindUniqueArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Meeting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingFindUniqueOrThrowArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meeting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindFirstArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingFindFirstArgs>(args?: SelectSubset<T, MeetingFindFirstArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Meeting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindFirstOrThrowArgs} args - Arguments to find a Meeting
     * @example
     * // Get one Meeting
     * const meeting = await prisma.meeting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Meetings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Meetings
     * const meetings = await prisma.meeting.findMany()
     * 
     * // Get first 10 Meetings
     * const meetings = await prisma.meeting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingWithIdOnly = await prisma.meeting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingFindManyArgs>(args?: SelectSubset<T, MeetingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Meeting.
     * @param {MeetingCreateArgs} args - Arguments to create a Meeting.
     * @example
     * // Create one Meeting
     * const Meeting = await prisma.meeting.create({
     *   data: {
     *     // ... data to create a Meeting
     *   }
     * })
     * 
     */
    create<T extends MeetingCreateArgs>(args: SelectSubset<T, MeetingCreateArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Meetings.
     * @param {MeetingCreateManyArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meeting = await prisma.meeting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingCreateManyArgs>(args?: SelectSubset<T, MeetingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Meetings and returns the data saved in the database.
     * @param {MeetingCreateManyAndReturnArgs} args - Arguments to create many Meetings.
     * @example
     * // Create many Meetings
     * const meeting = await prisma.meeting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Meetings and only return the `id`
     * const meetingWithIdOnly = await prisma.meeting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Meeting.
     * @param {MeetingDeleteArgs} args - Arguments to delete one Meeting.
     * @example
     * // Delete one Meeting
     * const Meeting = await prisma.meeting.delete({
     *   where: {
     *     // ... filter to delete one Meeting
     *   }
     * })
     * 
     */
    delete<T extends MeetingDeleteArgs>(args: SelectSubset<T, MeetingDeleteArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Meeting.
     * @param {MeetingUpdateArgs} args - Arguments to update one Meeting.
     * @example
     * // Update one Meeting
     * const meeting = await prisma.meeting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingUpdateArgs>(args: SelectSubset<T, MeetingUpdateArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Meetings.
     * @param {MeetingDeleteManyArgs} args - Arguments to filter Meetings to delete.
     * @example
     * // Delete a few Meetings
     * const { count } = await prisma.meeting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingDeleteManyArgs>(args?: SelectSubset<T, MeetingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Meetings
     * const meeting = await prisma.meeting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingUpdateManyArgs>(args: SelectSubset<T, MeetingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Meetings and returns the data updated in the database.
     * @param {MeetingUpdateManyAndReturnArgs} args - Arguments to update many Meetings.
     * @example
     * // Update many Meetings
     * const meeting = await prisma.meeting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Meetings and only return the `id`
     * const meetingWithIdOnly = await prisma.meeting.updateManyAndReturn({
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
    updateManyAndReturn<T extends MeetingUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Meeting.
     * @param {MeetingUpsertArgs} args - Arguments to update or create a Meeting.
     * @example
     * // Update or create a Meeting
     * const meeting = await prisma.meeting.upsert({
     *   create: {
     *     // ... data to create a Meeting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Meeting we want to update
     *   }
     * })
     */
    upsert<T extends MeetingUpsertArgs>(args: SelectSubset<T, MeetingUpsertArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Meetings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingCountArgs} args - Arguments to filter Meetings to count.
     * @example
     * // Count the number of Meetings
     * const count = await prisma.meeting.count({
     *   where: {
     *     // ... the filter for the Meetings we want to count
     *   }
     * })
    **/
    count<T extends MeetingCountArgs>(
      args?: Subset<T, MeetingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Meeting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MeetingAggregateArgs>(args: Subset<T, MeetingAggregateArgs>): Prisma.PrismaPromise<GetMeetingAggregateType<T>>

    /**
     * Group by Meeting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingGroupByArgs} args - Group by arguments.
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
      T extends MeetingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingGroupByArgs['orderBy'] }
        : { orderBy?: MeetingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MeetingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Meeting model
   */
  readonly fields: MeetingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Meeting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organizer<T extends Meeting$organizerArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$organizerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    participants<T extends Meeting$participantsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    audioFiles<T extends Meeting$audioFilesArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$audioFilesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transcript<T extends Meeting$transcriptArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$transcriptArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mom<T extends Meeting$momArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$momArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    actionItems<T extends Meeting$actionItemsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$actionItemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    decisions<T extends Meeting$decisionsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$decisionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    summary<T extends Meeting$summaryArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$summaryArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    auditLogs<T extends Meeting$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    invites<T extends Meeting$invitesArgs<ExtArgs> = {}>(args?: Subset<T, Meeting$invitesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Meeting model
   */
  interface MeetingFieldRefs {
    readonly id: FieldRef<"Meeting", 'String'>
    readonly title: FieldRef<"Meeting", 'String'>
    readonly description: FieldRef<"Meeting", 'String'>
    readonly scheduledAt: FieldRef<"Meeting", 'DateTime'>
    readonly durationMinutes: FieldRef<"Meeting", 'Int'>
    readonly status: FieldRef<"Meeting", 'MeetingStatus'>
    readonly tag: FieldRef<"Meeting", 'MeetingTag'>
    readonly notes: FieldRef<"Meeting", 'String'>
    readonly calendarEventId: FieldRef<"Meeting", 'String'>
    readonly recordingUrl: FieldRef<"Meeting", 'String'>
    readonly organizerId: FieldRef<"Meeting", 'String'>
    readonly createdAt: FieldRef<"Meeting", 'DateTime'>
    readonly updatedAt: FieldRef<"Meeting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Meeting findUnique
   */
  export type MeetingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting findUniqueOrThrow
   */
  export type MeetingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting findFirst
   */
  export type MeetingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting findFirstOrThrow
   */
  export type MeetingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meeting to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting findMany
   */
  export type MeetingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter, which Meetings to fetch.
     */
    where?: MeetingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Meetings to fetch.
     */
    orderBy?: MeetingOrderByWithRelationInput | MeetingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Meetings.
     */
    cursor?: MeetingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Meetings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Meetings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Meetings.
     */
    distinct?: MeetingScalarFieldEnum | MeetingScalarFieldEnum[]
  }

  /**
   * Meeting create
   */
  export type MeetingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The data needed to create a Meeting.
     */
    data: XOR<MeetingCreateInput, MeetingUncheckedCreateInput>
  }

  /**
   * Meeting createMany
   */
  export type MeetingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Meetings.
     */
    data: MeetingCreateManyInput | MeetingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Meeting createManyAndReturn
   */
  export type MeetingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * The data used to create many Meetings.
     */
    data: MeetingCreateManyInput | MeetingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Meeting update
   */
  export type MeetingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The data needed to update a Meeting.
     */
    data: XOR<MeetingUpdateInput, MeetingUncheckedUpdateInput>
    /**
     * Choose, which Meeting to update.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting updateMany
   */
  export type MeetingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Meetings.
     */
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyInput>
    /**
     * Filter which Meetings to update
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to update.
     */
    limit?: number
  }

  /**
   * Meeting updateManyAndReturn
   */
  export type MeetingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * The data used to update Meetings.
     */
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyInput>
    /**
     * Filter which Meetings to update
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Meeting upsert
   */
  export type MeetingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * The filter to search for the Meeting to update in case it exists.
     */
    where: MeetingWhereUniqueInput
    /**
     * In case the Meeting found by the `where` argument doesn't exist, create a new Meeting with this data.
     */
    create: XOR<MeetingCreateInput, MeetingUncheckedCreateInput>
    /**
     * In case the Meeting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingUpdateInput, MeetingUncheckedUpdateInput>
  }

  /**
   * Meeting delete
   */
  export type MeetingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    /**
     * Filter which Meeting to delete.
     */
    where: MeetingWhereUniqueInput
  }

  /**
   * Meeting deleteMany
   */
  export type MeetingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Meetings to delete
     */
    where?: MeetingWhereInput
    /**
     * Limit how many Meetings to delete.
     */
    limit?: number
  }

  /**
   * Meeting.organizer
   */
  export type Meeting$organizerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * Meeting.participants
   */
  export type Meeting$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    where?: MeetingParticipantWhereInput
    orderBy?: MeetingParticipantOrderByWithRelationInput | MeetingParticipantOrderByWithRelationInput[]
    cursor?: MeetingParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingParticipantScalarFieldEnum | MeetingParticipantScalarFieldEnum[]
  }

  /**
   * Meeting.audioFiles
   */
  export type Meeting$audioFilesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    where?: AudioFileWhereInput
    orderBy?: AudioFileOrderByWithRelationInput | AudioFileOrderByWithRelationInput[]
    cursor?: AudioFileWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AudioFileScalarFieldEnum | AudioFileScalarFieldEnum[]
  }

  /**
   * Meeting.transcript
   */
  export type Meeting$transcriptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    where?: TranscriptWhereInput
  }

  /**
   * Meeting.mom
   */
  export type Meeting$momArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    where?: MomWhereInput
  }

  /**
   * Meeting.actionItems
   */
  export type Meeting$actionItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    where?: ActionItemWhereInput
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    cursor?: ActionItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ActionItemScalarFieldEnum | ActionItemScalarFieldEnum[]
  }

  /**
   * Meeting.decisions
   */
  export type Meeting$decisionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    where?: DecisionWhereInput
    orderBy?: DecisionOrderByWithRelationInput | DecisionOrderByWithRelationInput[]
    cursor?: DecisionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DecisionScalarFieldEnum | DecisionScalarFieldEnum[]
  }

  /**
   * Meeting.summary
   */
  export type Meeting$summaryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    where?: SummaryWhereInput
  }

  /**
   * Meeting.auditLogs
   */
  export type Meeting$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * Meeting.invites
   */
  export type Meeting$invitesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    where?: MeetingInviteWhereInput
    orderBy?: MeetingInviteOrderByWithRelationInput | MeetingInviteOrderByWithRelationInput[]
    cursor?: MeetingInviteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MeetingInviteScalarFieldEnum | MeetingInviteScalarFieldEnum[]
  }

  /**
   * Meeting without action
   */
  export type MeetingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
  }


  /**
   * Model MeetingInvite
   */

  export type AggregateMeetingInvite = {
    _count: MeetingInviteCountAggregateOutputType | null
    _min: MeetingInviteMinAggregateOutputType | null
    _max: MeetingInviteMaxAggregateOutputType | null
  }

  export type MeetingInviteMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    email: string | null
    name: string | null
    status: $Enums.InviteStatus | null
    error: string | null
    sentAt: Date | null
  }

  export type MeetingInviteMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    email: string | null
    name: string | null
    status: $Enums.InviteStatus | null
    error: string | null
    sentAt: Date | null
  }

  export type MeetingInviteCountAggregateOutputType = {
    id: number
    meetingId: number
    email: number
    name: number
    status: number
    error: number
    sentAt: number
    _all: number
  }


  export type MeetingInviteMinAggregateInputType = {
    id?: true
    meetingId?: true
    email?: true
    name?: true
    status?: true
    error?: true
    sentAt?: true
  }

  export type MeetingInviteMaxAggregateInputType = {
    id?: true
    meetingId?: true
    email?: true
    name?: true
    status?: true
    error?: true
    sentAt?: true
  }

  export type MeetingInviteCountAggregateInputType = {
    id?: true
    meetingId?: true
    email?: true
    name?: true
    status?: true
    error?: true
    sentAt?: true
    _all?: true
  }

  export type MeetingInviteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingInvite to aggregate.
     */
    where?: MeetingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingInvites to fetch.
     */
    orderBy?: MeetingInviteOrderByWithRelationInput | MeetingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeetingInvites
    **/
    _count?: true | MeetingInviteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingInviteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingInviteMaxAggregateInputType
  }

  export type GetMeetingInviteAggregateType<T extends MeetingInviteAggregateArgs> = {
        [P in keyof T & keyof AggregateMeetingInvite]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeetingInvite[P]>
      : GetScalarType<T[P], AggregateMeetingInvite[P]>
  }




  export type MeetingInviteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingInviteWhereInput
    orderBy?: MeetingInviteOrderByWithAggregationInput | MeetingInviteOrderByWithAggregationInput[]
    by: MeetingInviteScalarFieldEnum[] | MeetingInviteScalarFieldEnum
    having?: MeetingInviteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingInviteCountAggregateInputType | true
    _min?: MeetingInviteMinAggregateInputType
    _max?: MeetingInviteMaxAggregateInputType
  }

  export type MeetingInviteGroupByOutputType = {
    id: string
    meetingId: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error: string | null
    sentAt: Date
    _count: MeetingInviteCountAggregateOutputType | null
    _min: MeetingInviteMinAggregateOutputType | null
    _max: MeetingInviteMaxAggregateOutputType | null
  }

  type GetMeetingInviteGroupByPayload<T extends MeetingInviteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingInviteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingInviteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingInviteGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingInviteGroupByOutputType[P]>
        }
      >
    >


  export type MeetingInviteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    email?: boolean
    name?: boolean
    status?: boolean
    error?: boolean
    sentAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingInvite"]>

  export type MeetingInviteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    email?: boolean
    name?: boolean
    status?: boolean
    error?: boolean
    sentAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingInvite"]>

  export type MeetingInviteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    email?: boolean
    name?: boolean
    status?: boolean
    error?: boolean
    sentAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingInvite"]>

  export type MeetingInviteSelectScalar = {
    id?: boolean
    meetingId?: boolean
    email?: boolean
    name?: boolean
    status?: boolean
    error?: boolean
    sentAt?: boolean
  }

  export type MeetingInviteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "email" | "name" | "status" | "error" | "sentAt", ExtArgs["result"]["meetingInvite"]>
  export type MeetingInviteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingInviteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingInviteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $MeetingInvitePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeetingInvite"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      email: string
      name: string
      status: $Enums.InviteStatus
      error: string | null
      sentAt: Date
    }, ExtArgs["result"]["meetingInvite"]>
    composites: {}
  }

  type MeetingInviteGetPayload<S extends boolean | null | undefined | MeetingInviteDefaultArgs> = $Result.GetResult<Prisma.$MeetingInvitePayload, S>

  type MeetingInviteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingInviteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingInviteCountAggregateInputType | true
    }

  export interface MeetingInviteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeetingInvite'], meta: { name: 'MeetingInvite' } }
    /**
     * Find zero or one MeetingInvite that matches the filter.
     * @param {MeetingInviteFindUniqueArgs} args - Arguments to find a MeetingInvite
     * @example
     * // Get one MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingInviteFindUniqueArgs>(args: SelectSubset<T, MeetingInviteFindUniqueArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeetingInvite that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingInviteFindUniqueOrThrowArgs} args - Arguments to find a MeetingInvite
     * @example
     * // Get one MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingInviteFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingInviteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingInvite that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteFindFirstArgs} args - Arguments to find a MeetingInvite
     * @example
     * // Get one MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingInviteFindFirstArgs>(args?: SelectSubset<T, MeetingInviteFindFirstArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingInvite that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteFindFirstOrThrowArgs} args - Arguments to find a MeetingInvite
     * @example
     * // Get one MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingInviteFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingInviteFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeetingInvites that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeetingInvites
     * const meetingInvites = await prisma.meetingInvite.findMany()
     * 
     * // Get first 10 MeetingInvites
     * const meetingInvites = await prisma.meetingInvite.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingInviteWithIdOnly = await prisma.meetingInvite.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingInviteFindManyArgs>(args?: SelectSubset<T, MeetingInviteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeetingInvite.
     * @param {MeetingInviteCreateArgs} args - Arguments to create a MeetingInvite.
     * @example
     * // Create one MeetingInvite
     * const MeetingInvite = await prisma.meetingInvite.create({
     *   data: {
     *     // ... data to create a MeetingInvite
     *   }
     * })
     * 
     */
    create<T extends MeetingInviteCreateArgs>(args: SelectSubset<T, MeetingInviteCreateArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeetingInvites.
     * @param {MeetingInviteCreateManyArgs} args - Arguments to create many MeetingInvites.
     * @example
     * // Create many MeetingInvites
     * const meetingInvite = await prisma.meetingInvite.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingInviteCreateManyArgs>(args?: SelectSubset<T, MeetingInviteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeetingInvites and returns the data saved in the database.
     * @param {MeetingInviteCreateManyAndReturnArgs} args - Arguments to create many MeetingInvites.
     * @example
     * // Create many MeetingInvites
     * const meetingInvite = await prisma.meetingInvite.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeetingInvites and only return the `id`
     * const meetingInviteWithIdOnly = await prisma.meetingInvite.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingInviteCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingInviteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeetingInvite.
     * @param {MeetingInviteDeleteArgs} args - Arguments to delete one MeetingInvite.
     * @example
     * // Delete one MeetingInvite
     * const MeetingInvite = await prisma.meetingInvite.delete({
     *   where: {
     *     // ... filter to delete one MeetingInvite
     *   }
     * })
     * 
     */
    delete<T extends MeetingInviteDeleteArgs>(args: SelectSubset<T, MeetingInviteDeleteArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeetingInvite.
     * @param {MeetingInviteUpdateArgs} args - Arguments to update one MeetingInvite.
     * @example
     * // Update one MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingInviteUpdateArgs>(args: SelectSubset<T, MeetingInviteUpdateArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeetingInvites.
     * @param {MeetingInviteDeleteManyArgs} args - Arguments to filter MeetingInvites to delete.
     * @example
     * // Delete a few MeetingInvites
     * const { count } = await prisma.meetingInvite.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingInviteDeleteManyArgs>(args?: SelectSubset<T, MeetingInviteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeetingInvites
     * const meetingInvite = await prisma.meetingInvite.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingInviteUpdateManyArgs>(args: SelectSubset<T, MeetingInviteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingInvites and returns the data updated in the database.
     * @param {MeetingInviteUpdateManyAndReturnArgs} args - Arguments to update many MeetingInvites.
     * @example
     * // Update many MeetingInvites
     * const meetingInvite = await prisma.meetingInvite.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeetingInvites and only return the `id`
     * const meetingInviteWithIdOnly = await prisma.meetingInvite.updateManyAndReturn({
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
    updateManyAndReturn<T extends MeetingInviteUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingInviteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeetingInvite.
     * @param {MeetingInviteUpsertArgs} args - Arguments to update or create a MeetingInvite.
     * @example
     * // Update or create a MeetingInvite
     * const meetingInvite = await prisma.meetingInvite.upsert({
     *   create: {
     *     // ... data to create a MeetingInvite
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeetingInvite we want to update
     *   }
     * })
     */
    upsert<T extends MeetingInviteUpsertArgs>(args: SelectSubset<T, MeetingInviteUpsertArgs<ExtArgs>>): Prisma__MeetingInviteClient<$Result.GetResult<Prisma.$MeetingInvitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeetingInvites.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteCountArgs} args - Arguments to filter MeetingInvites to count.
     * @example
     * // Count the number of MeetingInvites
     * const count = await prisma.meetingInvite.count({
     *   where: {
     *     // ... the filter for the MeetingInvites we want to count
     *   }
     * })
    **/
    count<T extends MeetingInviteCountArgs>(
      args?: Subset<T, MeetingInviteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingInviteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeetingInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MeetingInviteAggregateArgs>(args: Subset<T, MeetingInviteAggregateArgs>): Prisma.PrismaPromise<GetMeetingInviteAggregateType<T>>

    /**
     * Group by MeetingInvite.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingInviteGroupByArgs} args - Group by arguments.
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
      T extends MeetingInviteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingInviteGroupByArgs['orderBy'] }
        : { orderBy?: MeetingInviteGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MeetingInviteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingInviteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeetingInvite model
   */
  readonly fields: MeetingInviteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeetingInvite.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingInviteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MeetingInvite model
   */
  interface MeetingInviteFieldRefs {
    readonly id: FieldRef<"MeetingInvite", 'String'>
    readonly meetingId: FieldRef<"MeetingInvite", 'String'>
    readonly email: FieldRef<"MeetingInvite", 'String'>
    readonly name: FieldRef<"MeetingInvite", 'String'>
    readonly status: FieldRef<"MeetingInvite", 'InviteStatus'>
    readonly error: FieldRef<"MeetingInvite", 'String'>
    readonly sentAt: FieldRef<"MeetingInvite", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MeetingInvite findUnique
   */
  export type MeetingInviteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter, which MeetingInvite to fetch.
     */
    where: MeetingInviteWhereUniqueInput
  }

  /**
   * MeetingInvite findUniqueOrThrow
   */
  export type MeetingInviteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter, which MeetingInvite to fetch.
     */
    where: MeetingInviteWhereUniqueInput
  }

  /**
   * MeetingInvite findFirst
   */
  export type MeetingInviteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter, which MeetingInvite to fetch.
     */
    where?: MeetingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingInvites to fetch.
     */
    orderBy?: MeetingInviteOrderByWithRelationInput | MeetingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingInvites.
     */
    cursor?: MeetingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingInvites.
     */
    distinct?: MeetingInviteScalarFieldEnum | MeetingInviteScalarFieldEnum[]
  }

  /**
   * MeetingInvite findFirstOrThrow
   */
  export type MeetingInviteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter, which MeetingInvite to fetch.
     */
    where?: MeetingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingInvites to fetch.
     */
    orderBy?: MeetingInviteOrderByWithRelationInput | MeetingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingInvites.
     */
    cursor?: MeetingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingInvites.
     */
    distinct?: MeetingInviteScalarFieldEnum | MeetingInviteScalarFieldEnum[]
  }

  /**
   * MeetingInvite findMany
   */
  export type MeetingInviteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter, which MeetingInvites to fetch.
     */
    where?: MeetingInviteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingInvites to fetch.
     */
    orderBy?: MeetingInviteOrderByWithRelationInput | MeetingInviteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeetingInvites.
     */
    cursor?: MeetingInviteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingInvites from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingInvites.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingInvites.
     */
    distinct?: MeetingInviteScalarFieldEnum | MeetingInviteScalarFieldEnum[]
  }

  /**
   * MeetingInvite create
   */
  export type MeetingInviteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * The data needed to create a MeetingInvite.
     */
    data: XOR<MeetingInviteCreateInput, MeetingInviteUncheckedCreateInput>
  }

  /**
   * MeetingInvite createMany
   */
  export type MeetingInviteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeetingInvites.
     */
    data: MeetingInviteCreateManyInput | MeetingInviteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeetingInvite createManyAndReturn
   */
  export type MeetingInviteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * The data used to create many MeetingInvites.
     */
    data: MeetingInviteCreateManyInput | MeetingInviteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingInvite update
   */
  export type MeetingInviteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * The data needed to update a MeetingInvite.
     */
    data: XOR<MeetingInviteUpdateInput, MeetingInviteUncheckedUpdateInput>
    /**
     * Choose, which MeetingInvite to update.
     */
    where: MeetingInviteWhereUniqueInput
  }

  /**
   * MeetingInvite updateMany
   */
  export type MeetingInviteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeetingInvites.
     */
    data: XOR<MeetingInviteUpdateManyMutationInput, MeetingInviteUncheckedUpdateManyInput>
    /**
     * Filter which MeetingInvites to update
     */
    where?: MeetingInviteWhereInput
    /**
     * Limit how many MeetingInvites to update.
     */
    limit?: number
  }

  /**
   * MeetingInvite updateManyAndReturn
   */
  export type MeetingInviteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * The data used to update MeetingInvites.
     */
    data: XOR<MeetingInviteUpdateManyMutationInput, MeetingInviteUncheckedUpdateManyInput>
    /**
     * Filter which MeetingInvites to update
     */
    where?: MeetingInviteWhereInput
    /**
     * Limit how many MeetingInvites to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingInvite upsert
   */
  export type MeetingInviteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * The filter to search for the MeetingInvite to update in case it exists.
     */
    where: MeetingInviteWhereUniqueInput
    /**
     * In case the MeetingInvite found by the `where` argument doesn't exist, create a new MeetingInvite with this data.
     */
    create: XOR<MeetingInviteCreateInput, MeetingInviteUncheckedCreateInput>
    /**
     * In case the MeetingInvite was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingInviteUpdateInput, MeetingInviteUncheckedUpdateInput>
  }

  /**
   * MeetingInvite delete
   */
  export type MeetingInviteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
    /**
     * Filter which MeetingInvite to delete.
     */
    where: MeetingInviteWhereUniqueInput
  }

  /**
   * MeetingInvite deleteMany
   */
  export type MeetingInviteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingInvites to delete
     */
    where?: MeetingInviteWhereInput
    /**
     * Limit how many MeetingInvites to delete.
     */
    limit?: number
  }

  /**
   * MeetingInvite without action
   */
  export type MeetingInviteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingInvite
     */
    select?: MeetingInviteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingInvite
     */
    omit?: MeetingInviteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInviteInclude<ExtArgs> | null
  }


  /**
   * Model MeetingParticipant
   */

  export type AggregateMeetingParticipant = {
    _count: MeetingParticipantCountAggregateOutputType | null
    _min: MeetingParticipantMinAggregateOutputType | null
    _max: MeetingParticipantMaxAggregateOutputType | null
  }

  export type MeetingParticipantMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    name: string | null
    email: string | null
    role: string | null
  }

  export type MeetingParticipantMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    name: string | null
    email: string | null
    role: string | null
  }

  export type MeetingParticipantCountAggregateOutputType = {
    id: number
    meetingId: number
    name: number
    email: number
    role: number
    _all: number
  }


  export type MeetingParticipantMinAggregateInputType = {
    id?: true
    meetingId?: true
    name?: true
    email?: true
    role?: true
  }

  export type MeetingParticipantMaxAggregateInputType = {
    id?: true
    meetingId?: true
    name?: true
    email?: true
    role?: true
  }

  export type MeetingParticipantCountAggregateInputType = {
    id?: true
    meetingId?: true
    name?: true
    email?: true
    role?: true
    _all?: true
  }

  export type MeetingParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingParticipant to aggregate.
     */
    where?: MeetingParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingParticipants to fetch.
     */
    orderBy?: MeetingParticipantOrderByWithRelationInput | MeetingParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeetingParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeetingParticipants
    **/
    _count?: true | MeetingParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeetingParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeetingParticipantMaxAggregateInputType
  }

  export type GetMeetingParticipantAggregateType<T extends MeetingParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateMeetingParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeetingParticipant[P]>
      : GetScalarType<T[P], AggregateMeetingParticipant[P]>
  }




  export type MeetingParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeetingParticipantWhereInput
    orderBy?: MeetingParticipantOrderByWithAggregationInput | MeetingParticipantOrderByWithAggregationInput[]
    by: MeetingParticipantScalarFieldEnum[] | MeetingParticipantScalarFieldEnum
    having?: MeetingParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeetingParticipantCountAggregateInputType | true
    _min?: MeetingParticipantMinAggregateInputType
    _max?: MeetingParticipantMaxAggregateInputType
  }

  export type MeetingParticipantGroupByOutputType = {
    id: string
    meetingId: string
    name: string
    email: string
    role: string | null
    _count: MeetingParticipantCountAggregateOutputType | null
    _min: MeetingParticipantMinAggregateOutputType | null
    _max: MeetingParticipantMaxAggregateOutputType | null
  }

  type GetMeetingParticipantGroupByPayload<T extends MeetingParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeetingParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeetingParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeetingParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], MeetingParticipantGroupByOutputType[P]>
        }
      >
    >


  export type MeetingParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingParticipant"]>

  export type MeetingParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingParticipant"]>

  export type MeetingParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meetingParticipant"]>

  export type MeetingParticipantSelectScalar = {
    id?: boolean
    meetingId?: boolean
    name?: boolean
    email?: boolean
    role?: boolean
  }

  export type MeetingParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "name" | "email" | "role", ExtArgs["result"]["meetingParticipant"]>
  export type MeetingParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MeetingParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $MeetingParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeetingParticipant"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      name: string
      email: string
      role: string | null
    }, ExtArgs["result"]["meetingParticipant"]>
    composites: {}
  }

  type MeetingParticipantGetPayload<S extends boolean | null | undefined | MeetingParticipantDefaultArgs> = $Result.GetResult<Prisma.$MeetingParticipantPayload, S>

  type MeetingParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeetingParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeetingParticipantCountAggregateInputType | true
    }

  export interface MeetingParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeetingParticipant'], meta: { name: 'MeetingParticipant' } }
    /**
     * Find zero or one MeetingParticipant that matches the filter.
     * @param {MeetingParticipantFindUniqueArgs} args - Arguments to find a MeetingParticipant
     * @example
     * // Get one MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeetingParticipantFindUniqueArgs>(args: SelectSubset<T, MeetingParticipantFindUniqueArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeetingParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeetingParticipantFindUniqueOrThrowArgs} args - Arguments to find a MeetingParticipant
     * @example
     * // Get one MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeetingParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, MeetingParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantFindFirstArgs} args - Arguments to find a MeetingParticipant
     * @example
     * // Get one MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeetingParticipantFindFirstArgs>(args?: SelectSubset<T, MeetingParticipantFindFirstArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeetingParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantFindFirstOrThrowArgs} args - Arguments to find a MeetingParticipant
     * @example
     * // Get one MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeetingParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, MeetingParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeetingParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeetingParticipants
     * const meetingParticipants = await prisma.meetingParticipant.findMany()
     * 
     * // Get first 10 MeetingParticipants
     * const meetingParticipants = await prisma.meetingParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meetingParticipantWithIdOnly = await prisma.meetingParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeetingParticipantFindManyArgs>(args?: SelectSubset<T, MeetingParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeetingParticipant.
     * @param {MeetingParticipantCreateArgs} args - Arguments to create a MeetingParticipant.
     * @example
     * // Create one MeetingParticipant
     * const MeetingParticipant = await prisma.meetingParticipant.create({
     *   data: {
     *     // ... data to create a MeetingParticipant
     *   }
     * })
     * 
     */
    create<T extends MeetingParticipantCreateArgs>(args: SelectSubset<T, MeetingParticipantCreateArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeetingParticipants.
     * @param {MeetingParticipantCreateManyArgs} args - Arguments to create many MeetingParticipants.
     * @example
     * // Create many MeetingParticipants
     * const meetingParticipant = await prisma.meetingParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeetingParticipantCreateManyArgs>(args?: SelectSubset<T, MeetingParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeetingParticipants and returns the data saved in the database.
     * @param {MeetingParticipantCreateManyAndReturnArgs} args - Arguments to create many MeetingParticipants.
     * @example
     * // Create many MeetingParticipants
     * const meetingParticipant = await prisma.meetingParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeetingParticipants and only return the `id`
     * const meetingParticipantWithIdOnly = await prisma.meetingParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeetingParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, MeetingParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeetingParticipant.
     * @param {MeetingParticipantDeleteArgs} args - Arguments to delete one MeetingParticipant.
     * @example
     * // Delete one MeetingParticipant
     * const MeetingParticipant = await prisma.meetingParticipant.delete({
     *   where: {
     *     // ... filter to delete one MeetingParticipant
     *   }
     * })
     * 
     */
    delete<T extends MeetingParticipantDeleteArgs>(args: SelectSubset<T, MeetingParticipantDeleteArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeetingParticipant.
     * @param {MeetingParticipantUpdateArgs} args - Arguments to update one MeetingParticipant.
     * @example
     * // Update one MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeetingParticipantUpdateArgs>(args: SelectSubset<T, MeetingParticipantUpdateArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeetingParticipants.
     * @param {MeetingParticipantDeleteManyArgs} args - Arguments to filter MeetingParticipants to delete.
     * @example
     * // Delete a few MeetingParticipants
     * const { count } = await prisma.meetingParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeetingParticipantDeleteManyArgs>(args?: SelectSubset<T, MeetingParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeetingParticipants
     * const meetingParticipant = await prisma.meetingParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeetingParticipantUpdateManyArgs>(args: SelectSubset<T, MeetingParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeetingParticipants and returns the data updated in the database.
     * @param {MeetingParticipantUpdateManyAndReturnArgs} args - Arguments to update many MeetingParticipants.
     * @example
     * // Update many MeetingParticipants
     * const meetingParticipant = await prisma.meetingParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeetingParticipants and only return the `id`
     * const meetingParticipantWithIdOnly = await prisma.meetingParticipant.updateManyAndReturn({
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
    updateManyAndReturn<T extends MeetingParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, MeetingParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeetingParticipant.
     * @param {MeetingParticipantUpsertArgs} args - Arguments to update or create a MeetingParticipant.
     * @example
     * // Update or create a MeetingParticipant
     * const meetingParticipant = await prisma.meetingParticipant.upsert({
     *   create: {
     *     // ... data to create a MeetingParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeetingParticipant we want to update
     *   }
     * })
     */
    upsert<T extends MeetingParticipantUpsertArgs>(args: SelectSubset<T, MeetingParticipantUpsertArgs<ExtArgs>>): Prisma__MeetingParticipantClient<$Result.GetResult<Prisma.$MeetingParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeetingParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantCountArgs} args - Arguments to filter MeetingParticipants to count.
     * @example
     * // Count the number of MeetingParticipants
     * const count = await prisma.meetingParticipant.count({
     *   where: {
     *     // ... the filter for the MeetingParticipants we want to count
     *   }
     * })
    **/
    count<T extends MeetingParticipantCountArgs>(
      args?: Subset<T, MeetingParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeetingParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeetingParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MeetingParticipantAggregateArgs>(args: Subset<T, MeetingParticipantAggregateArgs>): Prisma.PrismaPromise<GetMeetingParticipantAggregateType<T>>

    /**
     * Group by MeetingParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeetingParticipantGroupByArgs} args - Group by arguments.
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
      T extends MeetingParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeetingParticipantGroupByArgs['orderBy'] }
        : { orderBy?: MeetingParticipantGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MeetingParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeetingParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeetingParticipant model
   */
  readonly fields: MeetingParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeetingParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeetingParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the MeetingParticipant model
   */
  interface MeetingParticipantFieldRefs {
    readonly id: FieldRef<"MeetingParticipant", 'String'>
    readonly meetingId: FieldRef<"MeetingParticipant", 'String'>
    readonly name: FieldRef<"MeetingParticipant", 'String'>
    readonly email: FieldRef<"MeetingParticipant", 'String'>
    readonly role: FieldRef<"MeetingParticipant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MeetingParticipant findUnique
   */
  export type MeetingParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MeetingParticipant to fetch.
     */
    where: MeetingParticipantWhereUniqueInput
  }

  /**
   * MeetingParticipant findUniqueOrThrow
   */
  export type MeetingParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MeetingParticipant to fetch.
     */
    where: MeetingParticipantWhereUniqueInput
  }

  /**
   * MeetingParticipant findFirst
   */
  export type MeetingParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MeetingParticipant to fetch.
     */
    where?: MeetingParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingParticipants to fetch.
     */
    orderBy?: MeetingParticipantOrderByWithRelationInput | MeetingParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingParticipants.
     */
    cursor?: MeetingParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingParticipants.
     */
    distinct?: MeetingParticipantScalarFieldEnum | MeetingParticipantScalarFieldEnum[]
  }

  /**
   * MeetingParticipant findFirstOrThrow
   */
  export type MeetingParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MeetingParticipant to fetch.
     */
    where?: MeetingParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingParticipants to fetch.
     */
    orderBy?: MeetingParticipantOrderByWithRelationInput | MeetingParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeetingParticipants.
     */
    cursor?: MeetingParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingParticipants.
     */
    distinct?: MeetingParticipantScalarFieldEnum | MeetingParticipantScalarFieldEnum[]
  }

  /**
   * MeetingParticipant findMany
   */
  export type MeetingParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter, which MeetingParticipants to fetch.
     */
    where?: MeetingParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeetingParticipants to fetch.
     */
    orderBy?: MeetingParticipantOrderByWithRelationInput | MeetingParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeetingParticipants.
     */
    cursor?: MeetingParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeetingParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeetingParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeetingParticipants.
     */
    distinct?: MeetingParticipantScalarFieldEnum | MeetingParticipantScalarFieldEnum[]
  }

  /**
   * MeetingParticipant create
   */
  export type MeetingParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a MeetingParticipant.
     */
    data: XOR<MeetingParticipantCreateInput, MeetingParticipantUncheckedCreateInput>
  }

  /**
   * MeetingParticipant createMany
   */
  export type MeetingParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeetingParticipants.
     */
    data: MeetingParticipantCreateManyInput | MeetingParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeetingParticipant createManyAndReturn
   */
  export type MeetingParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many MeetingParticipants.
     */
    data: MeetingParticipantCreateManyInput | MeetingParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingParticipant update
   */
  export type MeetingParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a MeetingParticipant.
     */
    data: XOR<MeetingParticipantUpdateInput, MeetingParticipantUncheckedUpdateInput>
    /**
     * Choose, which MeetingParticipant to update.
     */
    where: MeetingParticipantWhereUniqueInput
  }

  /**
   * MeetingParticipant updateMany
   */
  export type MeetingParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeetingParticipants.
     */
    data: XOR<MeetingParticipantUpdateManyMutationInput, MeetingParticipantUncheckedUpdateManyInput>
    /**
     * Filter which MeetingParticipants to update
     */
    where?: MeetingParticipantWhereInput
    /**
     * Limit how many MeetingParticipants to update.
     */
    limit?: number
  }

  /**
   * MeetingParticipant updateManyAndReturn
   */
  export type MeetingParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * The data used to update MeetingParticipants.
     */
    data: XOR<MeetingParticipantUpdateManyMutationInput, MeetingParticipantUncheckedUpdateManyInput>
    /**
     * Filter which MeetingParticipants to update
     */
    where?: MeetingParticipantWhereInput
    /**
     * Limit how many MeetingParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MeetingParticipant upsert
   */
  export type MeetingParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the MeetingParticipant to update in case it exists.
     */
    where: MeetingParticipantWhereUniqueInput
    /**
     * In case the MeetingParticipant found by the `where` argument doesn't exist, create a new MeetingParticipant with this data.
     */
    create: XOR<MeetingParticipantCreateInput, MeetingParticipantUncheckedCreateInput>
    /**
     * In case the MeetingParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeetingParticipantUpdateInput, MeetingParticipantUncheckedUpdateInput>
  }

  /**
   * MeetingParticipant delete
   */
  export type MeetingParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
    /**
     * Filter which MeetingParticipant to delete.
     */
    where: MeetingParticipantWhereUniqueInput
  }

  /**
   * MeetingParticipant deleteMany
   */
  export type MeetingParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeetingParticipants to delete
     */
    where?: MeetingParticipantWhereInput
    /**
     * Limit how many MeetingParticipants to delete.
     */
    limit?: number
  }

  /**
   * MeetingParticipant without action
   */
  export type MeetingParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeetingParticipant
     */
    select?: MeetingParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeetingParticipant
     */
    omit?: MeetingParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingParticipantInclude<ExtArgs> | null
  }


  /**
   * Model AudioFile
   */

  export type AggregateAudioFile = {
    _count: AudioFileCountAggregateOutputType | null
    _avg: AudioFileAvgAggregateOutputType | null
    _sum: AudioFileSumAggregateOutputType | null
    _min: AudioFileMinAggregateOutputType | null
    _max: AudioFileMaxAggregateOutputType | null
  }

  export type AudioFileAvgAggregateOutputType = {
    sizeBytes: number | null
  }

  export type AudioFileSumAggregateOutputType = {
    sizeBytes: number | null
  }

  export type AudioFileMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    storageKey: string | null
    mimeType: string | null
    sizeBytes: number | null
    createdAt: Date | null
  }

  export type AudioFileMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    storageKey: string | null
    mimeType: string | null
    sizeBytes: number | null
    createdAt: Date | null
  }

  export type AudioFileCountAggregateOutputType = {
    id: number
    meetingId: number
    storageKey: number
    mimeType: number
    sizeBytes: number
    createdAt: number
    _all: number
  }


  export type AudioFileAvgAggregateInputType = {
    sizeBytes?: true
  }

  export type AudioFileSumAggregateInputType = {
    sizeBytes?: true
  }

  export type AudioFileMinAggregateInputType = {
    id?: true
    meetingId?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    createdAt?: true
  }

  export type AudioFileMaxAggregateInputType = {
    id?: true
    meetingId?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    createdAt?: true
  }

  export type AudioFileCountAggregateInputType = {
    id?: true
    meetingId?: true
    storageKey?: true
    mimeType?: true
    sizeBytes?: true
    createdAt?: true
    _all?: true
  }

  export type AudioFileAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AudioFile to aggregate.
     */
    where?: AudioFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AudioFiles to fetch.
     */
    orderBy?: AudioFileOrderByWithRelationInput | AudioFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AudioFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AudioFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AudioFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AudioFiles
    **/
    _count?: true | AudioFileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AudioFileAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AudioFileSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AudioFileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AudioFileMaxAggregateInputType
  }

  export type GetAudioFileAggregateType<T extends AudioFileAggregateArgs> = {
        [P in keyof T & keyof AggregateAudioFile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAudioFile[P]>
      : GetScalarType<T[P], AggregateAudioFile[P]>
  }




  export type AudioFileGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AudioFileWhereInput
    orderBy?: AudioFileOrderByWithAggregationInput | AudioFileOrderByWithAggregationInput[]
    by: AudioFileScalarFieldEnum[] | AudioFileScalarFieldEnum
    having?: AudioFileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AudioFileCountAggregateInputType | true
    _avg?: AudioFileAvgAggregateInputType
    _sum?: AudioFileSumAggregateInputType
    _min?: AudioFileMinAggregateInputType
    _max?: AudioFileMaxAggregateInputType
  }

  export type AudioFileGroupByOutputType = {
    id: string
    meetingId: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt: Date
    _count: AudioFileCountAggregateOutputType | null
    _avg: AudioFileAvgAggregateOutputType | null
    _sum: AudioFileSumAggregateOutputType | null
    _min: AudioFileMinAggregateOutputType | null
    _max: AudioFileMaxAggregateOutputType | null
  }

  type GetAudioFileGroupByPayload<T extends AudioFileGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AudioFileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AudioFileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AudioFileGroupByOutputType[P]>
            : GetScalarType<T[P], AudioFileGroupByOutputType[P]>
        }
      >
    >


  export type AudioFileSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["audioFile"]>

  export type AudioFileSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["audioFile"]>

  export type AudioFileSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["audioFile"]>

  export type AudioFileSelectScalar = {
    id?: boolean
    meetingId?: boolean
    storageKey?: boolean
    mimeType?: boolean
    sizeBytes?: boolean
    createdAt?: boolean
  }

  export type AudioFileOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "storageKey" | "mimeType" | "sizeBytes" | "createdAt", ExtArgs["result"]["audioFile"]>
  export type AudioFileInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type AudioFileIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type AudioFileIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $AudioFilePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AudioFile"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      storageKey: string
      mimeType: string
      sizeBytes: number
      createdAt: Date
    }, ExtArgs["result"]["audioFile"]>
    composites: {}
  }

  type AudioFileGetPayload<S extends boolean | null | undefined | AudioFileDefaultArgs> = $Result.GetResult<Prisma.$AudioFilePayload, S>

  type AudioFileCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AudioFileFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AudioFileCountAggregateInputType | true
    }

  export interface AudioFileDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AudioFile'], meta: { name: 'AudioFile' } }
    /**
     * Find zero or one AudioFile that matches the filter.
     * @param {AudioFileFindUniqueArgs} args - Arguments to find a AudioFile
     * @example
     * // Get one AudioFile
     * const audioFile = await prisma.audioFile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AudioFileFindUniqueArgs>(args: SelectSubset<T, AudioFileFindUniqueArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AudioFile that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AudioFileFindUniqueOrThrowArgs} args - Arguments to find a AudioFile
     * @example
     * // Get one AudioFile
     * const audioFile = await prisma.audioFile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AudioFileFindUniqueOrThrowArgs>(args: SelectSubset<T, AudioFileFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AudioFile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileFindFirstArgs} args - Arguments to find a AudioFile
     * @example
     * // Get one AudioFile
     * const audioFile = await prisma.audioFile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AudioFileFindFirstArgs>(args?: SelectSubset<T, AudioFileFindFirstArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AudioFile that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileFindFirstOrThrowArgs} args - Arguments to find a AudioFile
     * @example
     * // Get one AudioFile
     * const audioFile = await prisma.audioFile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AudioFileFindFirstOrThrowArgs>(args?: SelectSubset<T, AudioFileFindFirstOrThrowArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AudioFiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AudioFiles
     * const audioFiles = await prisma.audioFile.findMany()
     * 
     * // Get first 10 AudioFiles
     * const audioFiles = await prisma.audioFile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const audioFileWithIdOnly = await prisma.audioFile.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AudioFileFindManyArgs>(args?: SelectSubset<T, AudioFileFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AudioFile.
     * @param {AudioFileCreateArgs} args - Arguments to create a AudioFile.
     * @example
     * // Create one AudioFile
     * const AudioFile = await prisma.audioFile.create({
     *   data: {
     *     // ... data to create a AudioFile
     *   }
     * })
     * 
     */
    create<T extends AudioFileCreateArgs>(args: SelectSubset<T, AudioFileCreateArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AudioFiles.
     * @param {AudioFileCreateManyArgs} args - Arguments to create many AudioFiles.
     * @example
     * // Create many AudioFiles
     * const audioFile = await prisma.audioFile.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AudioFileCreateManyArgs>(args?: SelectSubset<T, AudioFileCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AudioFiles and returns the data saved in the database.
     * @param {AudioFileCreateManyAndReturnArgs} args - Arguments to create many AudioFiles.
     * @example
     * // Create many AudioFiles
     * const audioFile = await prisma.audioFile.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AudioFiles and only return the `id`
     * const audioFileWithIdOnly = await prisma.audioFile.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AudioFileCreateManyAndReturnArgs>(args?: SelectSubset<T, AudioFileCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AudioFile.
     * @param {AudioFileDeleteArgs} args - Arguments to delete one AudioFile.
     * @example
     * // Delete one AudioFile
     * const AudioFile = await prisma.audioFile.delete({
     *   where: {
     *     // ... filter to delete one AudioFile
     *   }
     * })
     * 
     */
    delete<T extends AudioFileDeleteArgs>(args: SelectSubset<T, AudioFileDeleteArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AudioFile.
     * @param {AudioFileUpdateArgs} args - Arguments to update one AudioFile.
     * @example
     * // Update one AudioFile
     * const audioFile = await prisma.audioFile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AudioFileUpdateArgs>(args: SelectSubset<T, AudioFileUpdateArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AudioFiles.
     * @param {AudioFileDeleteManyArgs} args - Arguments to filter AudioFiles to delete.
     * @example
     * // Delete a few AudioFiles
     * const { count } = await prisma.audioFile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AudioFileDeleteManyArgs>(args?: SelectSubset<T, AudioFileDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AudioFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AudioFiles
     * const audioFile = await prisma.audioFile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AudioFileUpdateManyArgs>(args: SelectSubset<T, AudioFileUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AudioFiles and returns the data updated in the database.
     * @param {AudioFileUpdateManyAndReturnArgs} args - Arguments to update many AudioFiles.
     * @example
     * // Update many AudioFiles
     * const audioFile = await prisma.audioFile.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AudioFiles and only return the `id`
     * const audioFileWithIdOnly = await prisma.audioFile.updateManyAndReturn({
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
    updateManyAndReturn<T extends AudioFileUpdateManyAndReturnArgs>(args: SelectSubset<T, AudioFileUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AudioFile.
     * @param {AudioFileUpsertArgs} args - Arguments to update or create a AudioFile.
     * @example
     * // Update or create a AudioFile
     * const audioFile = await prisma.audioFile.upsert({
     *   create: {
     *     // ... data to create a AudioFile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AudioFile we want to update
     *   }
     * })
     */
    upsert<T extends AudioFileUpsertArgs>(args: SelectSubset<T, AudioFileUpsertArgs<ExtArgs>>): Prisma__AudioFileClient<$Result.GetResult<Prisma.$AudioFilePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AudioFiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileCountArgs} args - Arguments to filter AudioFiles to count.
     * @example
     * // Count the number of AudioFiles
     * const count = await prisma.audioFile.count({
     *   where: {
     *     // ... the filter for the AudioFiles we want to count
     *   }
     * })
    **/
    count<T extends AudioFileCountArgs>(
      args?: Subset<T, AudioFileCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AudioFileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AudioFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AudioFileAggregateArgs>(args: Subset<T, AudioFileAggregateArgs>): Prisma.PrismaPromise<GetAudioFileAggregateType<T>>

    /**
     * Group by AudioFile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AudioFileGroupByArgs} args - Group by arguments.
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
      T extends AudioFileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AudioFileGroupByArgs['orderBy'] }
        : { orderBy?: AudioFileGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AudioFileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAudioFileGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AudioFile model
   */
  readonly fields: AudioFileFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AudioFile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AudioFileClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AudioFile model
   */
  interface AudioFileFieldRefs {
    readonly id: FieldRef<"AudioFile", 'String'>
    readonly meetingId: FieldRef<"AudioFile", 'String'>
    readonly storageKey: FieldRef<"AudioFile", 'String'>
    readonly mimeType: FieldRef<"AudioFile", 'String'>
    readonly sizeBytes: FieldRef<"AudioFile", 'Int'>
    readonly createdAt: FieldRef<"AudioFile", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AudioFile findUnique
   */
  export type AudioFileFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter, which AudioFile to fetch.
     */
    where: AudioFileWhereUniqueInput
  }

  /**
   * AudioFile findUniqueOrThrow
   */
  export type AudioFileFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter, which AudioFile to fetch.
     */
    where: AudioFileWhereUniqueInput
  }

  /**
   * AudioFile findFirst
   */
  export type AudioFileFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter, which AudioFile to fetch.
     */
    where?: AudioFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AudioFiles to fetch.
     */
    orderBy?: AudioFileOrderByWithRelationInput | AudioFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AudioFiles.
     */
    cursor?: AudioFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AudioFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AudioFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AudioFiles.
     */
    distinct?: AudioFileScalarFieldEnum | AudioFileScalarFieldEnum[]
  }

  /**
   * AudioFile findFirstOrThrow
   */
  export type AudioFileFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter, which AudioFile to fetch.
     */
    where?: AudioFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AudioFiles to fetch.
     */
    orderBy?: AudioFileOrderByWithRelationInput | AudioFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AudioFiles.
     */
    cursor?: AudioFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AudioFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AudioFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AudioFiles.
     */
    distinct?: AudioFileScalarFieldEnum | AudioFileScalarFieldEnum[]
  }

  /**
   * AudioFile findMany
   */
  export type AudioFileFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter, which AudioFiles to fetch.
     */
    where?: AudioFileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AudioFiles to fetch.
     */
    orderBy?: AudioFileOrderByWithRelationInput | AudioFileOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AudioFiles.
     */
    cursor?: AudioFileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AudioFiles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AudioFiles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AudioFiles.
     */
    distinct?: AudioFileScalarFieldEnum | AudioFileScalarFieldEnum[]
  }

  /**
   * AudioFile create
   */
  export type AudioFileCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * The data needed to create a AudioFile.
     */
    data: XOR<AudioFileCreateInput, AudioFileUncheckedCreateInput>
  }

  /**
   * AudioFile createMany
   */
  export type AudioFileCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AudioFiles.
     */
    data: AudioFileCreateManyInput | AudioFileCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AudioFile createManyAndReturn
   */
  export type AudioFileCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * The data used to create many AudioFiles.
     */
    data: AudioFileCreateManyInput | AudioFileCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AudioFile update
   */
  export type AudioFileUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * The data needed to update a AudioFile.
     */
    data: XOR<AudioFileUpdateInput, AudioFileUncheckedUpdateInput>
    /**
     * Choose, which AudioFile to update.
     */
    where: AudioFileWhereUniqueInput
  }

  /**
   * AudioFile updateMany
   */
  export type AudioFileUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AudioFiles.
     */
    data: XOR<AudioFileUpdateManyMutationInput, AudioFileUncheckedUpdateManyInput>
    /**
     * Filter which AudioFiles to update
     */
    where?: AudioFileWhereInput
    /**
     * Limit how many AudioFiles to update.
     */
    limit?: number
  }

  /**
   * AudioFile updateManyAndReturn
   */
  export type AudioFileUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * The data used to update AudioFiles.
     */
    data: XOR<AudioFileUpdateManyMutationInput, AudioFileUncheckedUpdateManyInput>
    /**
     * Filter which AudioFiles to update
     */
    where?: AudioFileWhereInput
    /**
     * Limit how many AudioFiles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AudioFile upsert
   */
  export type AudioFileUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * The filter to search for the AudioFile to update in case it exists.
     */
    where: AudioFileWhereUniqueInput
    /**
     * In case the AudioFile found by the `where` argument doesn't exist, create a new AudioFile with this data.
     */
    create: XOR<AudioFileCreateInput, AudioFileUncheckedCreateInput>
    /**
     * In case the AudioFile was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AudioFileUpdateInput, AudioFileUncheckedUpdateInput>
  }

  /**
   * AudioFile delete
   */
  export type AudioFileDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
    /**
     * Filter which AudioFile to delete.
     */
    where: AudioFileWhereUniqueInput
  }

  /**
   * AudioFile deleteMany
   */
  export type AudioFileDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AudioFiles to delete
     */
    where?: AudioFileWhereInput
    /**
     * Limit how many AudioFiles to delete.
     */
    limit?: number
  }

  /**
   * AudioFile without action
   */
  export type AudioFileDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AudioFile
     */
    select?: AudioFileSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AudioFile
     */
    omit?: AudioFileOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AudioFileInclude<ExtArgs> | null
  }


  /**
   * Model Transcript
   */

  export type AggregateTranscript = {
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  export type TranscriptMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    fullText: string | null
    language: string | null
    source: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    fullText: string | null
    language: string | null
    source: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TranscriptCountAggregateOutputType = {
    id: number
    meetingId: number
    fullText: number
    language: number
    source: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TranscriptMinAggregateInputType = {
    id?: true
    meetingId?: true
    fullText?: true
    language?: true
    source?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptMaxAggregateInputType = {
    id?: true
    meetingId?: true
    fullText?: true
    language?: true
    source?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TranscriptCountAggregateInputType = {
    id?: true
    meetingId?: true
    fullText?: true
    language?: true
    source?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TranscriptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcript to aggregate.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transcripts
    **/
    _count?: true | TranscriptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptMaxAggregateInputType
  }

  export type GetTranscriptAggregateType<T extends TranscriptAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscript]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscript[P]>
      : GetScalarType<T[P], AggregateTranscript[P]>
  }




  export type TranscriptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptWhereInput
    orderBy?: TranscriptOrderByWithAggregationInput | TranscriptOrderByWithAggregationInput[]
    by: TranscriptScalarFieldEnum[] | TranscriptScalarFieldEnum
    having?: TranscriptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptCountAggregateInputType | true
    _min?: TranscriptMinAggregateInputType
    _max?: TranscriptMaxAggregateInputType
  }

  export type TranscriptGroupByOutputType = {
    id: string
    meetingId: string
    fullText: string
    language: string
    source: string
    createdAt: Date
    updatedAt: Date
    _count: TranscriptCountAggregateOutputType | null
    _min: TranscriptMinAggregateOutputType | null
    _max: TranscriptMaxAggregateOutputType | null
  }

  type GetTranscriptGroupByPayload<T extends TranscriptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullText?: boolean
    language?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    segments?: boolean | Transcript$segmentsArgs<ExtArgs>
    _count?: boolean | TranscriptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullText?: boolean
    language?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    fullText?: boolean
    language?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcript"]>

  export type TranscriptSelectScalar = {
    id?: boolean
    meetingId?: boolean
    fullText?: boolean
    language?: boolean
    source?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TranscriptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "fullText" | "language" | "source" | "createdAt" | "updatedAt", ExtArgs["result"]["transcript"]>
  export type TranscriptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    segments?: boolean | Transcript$segmentsArgs<ExtArgs>
    _count?: boolean | TranscriptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type TranscriptIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $TranscriptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transcript"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
      segments: Prisma.$TranscriptSegmentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      fullText: string
      language: string
      source: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transcript"]>
    composites: {}
  }

  type TranscriptGetPayload<S extends boolean | null | undefined | TranscriptDefaultArgs> = $Result.GetResult<Prisma.$TranscriptPayload, S>

  type TranscriptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptCountAggregateInputType | true
    }

  export interface TranscriptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transcript'], meta: { name: 'Transcript' } }
    /**
     * Find zero or one Transcript that matches the filter.
     * @param {TranscriptFindUniqueArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptFindUniqueArgs>(args: SelectSubset<T, TranscriptFindUniqueArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transcript that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptFindUniqueOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptFindFirstArgs>(args?: SelectSubset<T, TranscriptFindFirstArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transcript that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindFirstOrThrowArgs} args - Arguments to find a Transcript
     * @example
     * // Get one Transcript
     * const transcript = await prisma.transcript.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transcripts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transcripts
     * const transcripts = await prisma.transcript.findMany()
     * 
     * // Get first 10 Transcripts
     * const transcripts = await prisma.transcript.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptWithIdOnly = await prisma.transcript.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptFindManyArgs>(args?: SelectSubset<T, TranscriptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transcript.
     * @param {TranscriptCreateArgs} args - Arguments to create a Transcript.
     * @example
     * // Create one Transcript
     * const Transcript = await prisma.transcript.create({
     *   data: {
     *     // ... data to create a Transcript
     *   }
     * })
     * 
     */
    create<T extends TranscriptCreateArgs>(args: SelectSubset<T, TranscriptCreateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transcripts.
     * @param {TranscriptCreateManyArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptCreateManyArgs>(args?: SelectSubset<T, TranscriptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transcripts and returns the data saved in the database.
     * @param {TranscriptCreateManyAndReturnArgs} args - Arguments to create many Transcripts.
     * @example
     * // Create many Transcripts
     * const transcript = await prisma.transcript.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transcript.
     * @param {TranscriptDeleteArgs} args - Arguments to delete one Transcript.
     * @example
     * // Delete one Transcript
     * const Transcript = await prisma.transcript.delete({
     *   where: {
     *     // ... filter to delete one Transcript
     *   }
     * })
     * 
     */
    delete<T extends TranscriptDeleteArgs>(args: SelectSubset<T, TranscriptDeleteArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transcript.
     * @param {TranscriptUpdateArgs} args - Arguments to update one Transcript.
     * @example
     * // Update one Transcript
     * const transcript = await prisma.transcript.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptUpdateArgs>(args: SelectSubset<T, TranscriptUpdateArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transcripts.
     * @param {TranscriptDeleteManyArgs} args - Arguments to filter Transcripts to delete.
     * @example
     * // Delete a few Transcripts
     * const { count } = await prisma.transcript.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptDeleteManyArgs>(args?: SelectSubset<T, TranscriptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptUpdateManyArgs>(args: SelectSubset<T, TranscriptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transcripts and returns the data updated in the database.
     * @param {TranscriptUpdateManyAndReturnArgs} args - Arguments to update many Transcripts.
     * @example
     * // Update many Transcripts
     * const transcript = await prisma.transcript.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transcripts and only return the `id`
     * const transcriptWithIdOnly = await prisma.transcript.updateManyAndReturn({
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
    updateManyAndReturn<T extends TranscriptUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transcript.
     * @param {TranscriptUpsertArgs} args - Arguments to update or create a Transcript.
     * @example
     * // Update or create a Transcript
     * const transcript = await prisma.transcript.upsert({
     *   create: {
     *     // ... data to create a Transcript
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transcript we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptUpsertArgs>(args: SelectSubset<T, TranscriptUpsertArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transcripts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptCountArgs} args - Arguments to filter Transcripts to count.
     * @example
     * // Count the number of Transcripts
     * const count = await prisma.transcript.count({
     *   where: {
     *     // ... the filter for the Transcripts we want to count
     *   }
     * })
    **/
    count<T extends TranscriptCountArgs>(
      args?: Subset<T, TranscriptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TranscriptAggregateArgs>(args: Subset<T, TranscriptAggregateArgs>): Prisma.PrismaPromise<GetTranscriptAggregateType<T>>

    /**
     * Group by Transcript.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptGroupByArgs} args - Group by arguments.
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
      T extends TranscriptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TranscriptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transcript model
   */
  readonly fields: TranscriptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transcript.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    segments<T extends Transcript$segmentsArgs<ExtArgs> = {}>(args?: Subset<T, Transcript$segmentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Transcript model
   */
  interface TranscriptFieldRefs {
    readonly id: FieldRef<"Transcript", 'String'>
    readonly meetingId: FieldRef<"Transcript", 'String'>
    readonly fullText: FieldRef<"Transcript", 'String'>
    readonly language: FieldRef<"Transcript", 'String'>
    readonly source: FieldRef<"Transcript", 'String'>
    readonly createdAt: FieldRef<"Transcript", 'DateTime'>
    readonly updatedAt: FieldRef<"Transcript", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transcript findUnique
   */
  export type TranscriptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findUniqueOrThrow
   */
  export type TranscriptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript findFirst
   */
  export type TranscriptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findFirstOrThrow
   */
  export type TranscriptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcript to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript findMany
   */
  export type TranscriptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter, which Transcripts to fetch.
     */
    where?: TranscriptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transcripts to fetch.
     */
    orderBy?: TranscriptOrderByWithRelationInput | TranscriptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transcripts.
     */
    cursor?: TranscriptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transcripts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transcripts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transcripts.
     */
    distinct?: TranscriptScalarFieldEnum | TranscriptScalarFieldEnum[]
  }

  /**
   * Transcript create
   */
  export type TranscriptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to create a Transcript.
     */
    data: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
  }

  /**
   * Transcript createMany
   */
  export type TranscriptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transcript createManyAndReturn
   */
  export type TranscriptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to create many Transcripts.
     */
    data: TranscriptCreateManyInput | TranscriptCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript update
   */
  export type TranscriptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The data needed to update a Transcript.
     */
    data: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
    /**
     * Choose, which Transcript to update.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript updateMany
   */
  export type TranscriptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
  }

  /**
   * Transcript updateManyAndReturn
   */
  export type TranscriptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * The data used to update Transcripts.
     */
    data: XOR<TranscriptUpdateManyMutationInput, TranscriptUncheckedUpdateManyInput>
    /**
     * Filter which Transcripts to update
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transcript upsert
   */
  export type TranscriptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * The filter to search for the Transcript to update in case it exists.
     */
    where: TranscriptWhereUniqueInput
    /**
     * In case the Transcript found by the `where` argument doesn't exist, create a new Transcript with this data.
     */
    create: XOR<TranscriptCreateInput, TranscriptUncheckedCreateInput>
    /**
     * In case the Transcript was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptUpdateInput, TranscriptUncheckedUpdateInput>
  }

  /**
   * Transcript delete
   */
  export type TranscriptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
    /**
     * Filter which Transcript to delete.
     */
    where: TranscriptWhereUniqueInput
  }

  /**
   * Transcript deleteMany
   */
  export type TranscriptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transcripts to delete
     */
    where?: TranscriptWhereInput
    /**
     * Limit how many Transcripts to delete.
     */
    limit?: number
  }

  /**
   * Transcript.segments
   */
  export type Transcript$segmentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    where?: TranscriptSegmentWhereInput
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    cursor?: TranscriptSegmentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * Transcript without action
   */
  export type TranscriptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transcript
     */
    select?: TranscriptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transcript
     */
    omit?: TranscriptOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptInclude<ExtArgs> | null
  }


  /**
   * Model TranscriptSegment
   */

  export type AggregateTranscriptSegment = {
    _count: TranscriptSegmentCountAggregateOutputType | null
    _avg: TranscriptSegmentAvgAggregateOutputType | null
    _sum: TranscriptSegmentSumAggregateOutputType | null
    _min: TranscriptSegmentMinAggregateOutputType | null
    _max: TranscriptSegmentMaxAggregateOutputType | null
  }

  export type TranscriptSegmentAvgAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    confidence: number | null
  }

  export type TranscriptSegmentSumAggregateOutputType = {
    startTime: number | null
    endTime: number | null
    confidence: number | null
  }

  export type TranscriptSegmentMinAggregateOutputType = {
    id: string | null
    transcriptId: string | null
    speaker: string | null
    startTime: number | null
    endTime: number | null
    text: string | null
    confidence: number | null
  }

  export type TranscriptSegmentMaxAggregateOutputType = {
    id: string | null
    transcriptId: string | null
    speaker: string | null
    startTime: number | null
    endTime: number | null
    text: string | null
    confidence: number | null
  }

  export type TranscriptSegmentCountAggregateOutputType = {
    id: number
    transcriptId: number
    speaker: number
    startTime: number
    endTime: number
    text: number
    confidence: number
    _all: number
  }


  export type TranscriptSegmentAvgAggregateInputType = {
    startTime?: true
    endTime?: true
    confidence?: true
  }

  export type TranscriptSegmentSumAggregateInputType = {
    startTime?: true
    endTime?: true
    confidence?: true
  }

  export type TranscriptSegmentMinAggregateInputType = {
    id?: true
    transcriptId?: true
    speaker?: true
    startTime?: true
    endTime?: true
    text?: true
    confidence?: true
  }

  export type TranscriptSegmentMaxAggregateInputType = {
    id?: true
    transcriptId?: true
    speaker?: true
    startTime?: true
    endTime?: true
    text?: true
    confidence?: true
  }

  export type TranscriptSegmentCountAggregateInputType = {
    id?: true
    transcriptId?: true
    speaker?: true
    startTime?: true
    endTime?: true
    text?: true
    confidence?: true
    _all?: true
  }

  export type TranscriptSegmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptSegment to aggregate.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TranscriptSegments
    **/
    _count?: true | TranscriptSegmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranscriptSegmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranscriptSegmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptSegmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptSegmentMaxAggregateInputType
  }

  export type GetTranscriptSegmentAggregateType<T extends TranscriptSegmentAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscriptSegment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscriptSegment[P]>
      : GetScalarType<T[P], AggregateTranscriptSegment[P]>
  }




  export type TranscriptSegmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptSegmentWhereInput
    orderBy?: TranscriptSegmentOrderByWithAggregationInput | TranscriptSegmentOrderByWithAggregationInput[]
    by: TranscriptSegmentScalarFieldEnum[] | TranscriptSegmentScalarFieldEnum
    having?: TranscriptSegmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptSegmentCountAggregateInputType | true
    _avg?: TranscriptSegmentAvgAggregateInputType
    _sum?: TranscriptSegmentSumAggregateInputType
    _min?: TranscriptSegmentMinAggregateInputType
    _max?: TranscriptSegmentMaxAggregateInputType
  }

  export type TranscriptSegmentGroupByOutputType = {
    id: string
    transcriptId: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence: number | null
    _count: TranscriptSegmentCountAggregateOutputType | null
    _avg: TranscriptSegmentAvgAggregateOutputType | null
    _sum: TranscriptSegmentSumAggregateOutputType | null
    _min: TranscriptSegmentMinAggregateOutputType | null
    _max: TranscriptSegmentMaxAggregateOutputType | null
  }

  type GetTranscriptSegmentGroupByPayload<T extends TranscriptSegmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptSegmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptSegmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptSegmentGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptSegmentGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptSegmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    speaker?: boolean
    startTime?: boolean
    endTime?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    speaker?: boolean
    startTime?: boolean
    endTime?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transcriptId?: boolean
    speaker?: boolean
    startTime?: boolean
    endTime?: boolean
    text?: boolean
    confidence?: boolean
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptSegment"]>

  export type TranscriptSegmentSelectScalar = {
    id?: boolean
    transcriptId?: boolean
    speaker?: boolean
    startTime?: boolean
    endTime?: boolean
    text?: boolean
    confidence?: boolean
  }

  export type TranscriptSegmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transcriptId" | "speaker" | "startTime" | "endTime" | "text" | "confidence", ExtArgs["result"]["transcriptSegment"]>
  export type TranscriptSegmentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }
  export type TranscriptSegmentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }
  export type TranscriptSegmentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcript?: boolean | TranscriptDefaultArgs<ExtArgs>
  }

  export type $TranscriptSegmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TranscriptSegment"
    objects: {
      transcript: Prisma.$TranscriptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      transcriptId: string
      speaker: string
      startTime: number
      endTime: number
      text: string
      confidence: number | null
    }, ExtArgs["result"]["transcriptSegment"]>
    composites: {}
  }

  type TranscriptSegmentGetPayload<S extends boolean | null | undefined | TranscriptSegmentDefaultArgs> = $Result.GetResult<Prisma.$TranscriptSegmentPayload, S>

  type TranscriptSegmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TranscriptSegmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TranscriptSegmentCountAggregateInputType | true
    }

  export interface TranscriptSegmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TranscriptSegment'], meta: { name: 'TranscriptSegment' } }
    /**
     * Find zero or one TranscriptSegment that matches the filter.
     * @param {TranscriptSegmentFindUniqueArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptSegmentFindUniqueArgs>(args: SelectSubset<T, TranscriptSegmentFindUniqueArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TranscriptSegment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TranscriptSegmentFindUniqueOrThrowArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptSegmentFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TranscriptSegment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindFirstArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptSegmentFindFirstArgs>(args?: SelectSubset<T, TranscriptSegmentFindFirstArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TranscriptSegment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindFirstOrThrowArgs} args - Arguments to find a TranscriptSegment
     * @example
     * // Get one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptSegmentFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptSegmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TranscriptSegments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TranscriptSegments
     * const transcriptSegments = await prisma.transcriptSegment.findMany()
     * 
     * // Get first 10 TranscriptSegments
     * const transcriptSegments = await prisma.transcriptSegment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptSegmentFindManyArgs>(args?: SelectSubset<T, TranscriptSegmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TranscriptSegment.
     * @param {TranscriptSegmentCreateArgs} args - Arguments to create a TranscriptSegment.
     * @example
     * // Create one TranscriptSegment
     * const TranscriptSegment = await prisma.transcriptSegment.create({
     *   data: {
     *     // ... data to create a TranscriptSegment
     *   }
     * })
     * 
     */
    create<T extends TranscriptSegmentCreateArgs>(args: SelectSubset<T, TranscriptSegmentCreateArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TranscriptSegments.
     * @param {TranscriptSegmentCreateManyArgs} args - Arguments to create many TranscriptSegments.
     * @example
     * // Create many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptSegmentCreateManyArgs>(args?: SelectSubset<T, TranscriptSegmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TranscriptSegments and returns the data saved in the database.
     * @param {TranscriptSegmentCreateManyAndReturnArgs} args - Arguments to create many TranscriptSegments.
     * @example
     * // Create many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TranscriptSegments and only return the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptSegmentCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptSegmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TranscriptSegment.
     * @param {TranscriptSegmentDeleteArgs} args - Arguments to delete one TranscriptSegment.
     * @example
     * // Delete one TranscriptSegment
     * const TranscriptSegment = await prisma.transcriptSegment.delete({
     *   where: {
     *     // ... filter to delete one TranscriptSegment
     *   }
     * })
     * 
     */
    delete<T extends TranscriptSegmentDeleteArgs>(args: SelectSubset<T, TranscriptSegmentDeleteArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TranscriptSegment.
     * @param {TranscriptSegmentUpdateArgs} args - Arguments to update one TranscriptSegment.
     * @example
     * // Update one TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptSegmentUpdateArgs>(args: SelectSubset<T, TranscriptSegmentUpdateArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TranscriptSegments.
     * @param {TranscriptSegmentDeleteManyArgs} args - Arguments to filter TranscriptSegments to delete.
     * @example
     * // Delete a few TranscriptSegments
     * const { count } = await prisma.transcriptSegment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptSegmentDeleteManyArgs>(args?: SelectSubset<T, TranscriptSegmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranscriptSegments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptSegmentUpdateManyArgs>(args: SelectSubset<T, TranscriptSegmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranscriptSegments and returns the data updated in the database.
     * @param {TranscriptSegmentUpdateManyAndReturnArgs} args - Arguments to update many TranscriptSegments.
     * @example
     * // Update many TranscriptSegments
     * const transcriptSegment = await prisma.transcriptSegment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TranscriptSegments and only return the `id`
     * const transcriptSegmentWithIdOnly = await prisma.transcriptSegment.updateManyAndReturn({
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
    updateManyAndReturn<T extends TranscriptSegmentUpdateManyAndReturnArgs>(args: SelectSubset<T, TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TranscriptSegment.
     * @param {TranscriptSegmentUpsertArgs} args - Arguments to update or create a TranscriptSegment.
     * @example
     * // Update or create a TranscriptSegment
     * const transcriptSegment = await prisma.transcriptSegment.upsert({
     *   create: {
     *     // ... data to create a TranscriptSegment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TranscriptSegment we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptSegmentUpsertArgs>(args: SelectSubset<T, TranscriptSegmentUpsertArgs<ExtArgs>>): Prisma__TranscriptSegmentClient<$Result.GetResult<Prisma.$TranscriptSegmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TranscriptSegments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentCountArgs} args - Arguments to filter TranscriptSegments to count.
     * @example
     * // Count the number of TranscriptSegments
     * const count = await prisma.transcriptSegment.count({
     *   where: {
     *     // ... the filter for the TranscriptSegments we want to count
     *   }
     * })
    **/
    count<T extends TranscriptSegmentCountArgs>(
      args?: Subset<T, TranscriptSegmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptSegmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TranscriptSegment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TranscriptSegmentAggregateArgs>(args: Subset<T, TranscriptSegmentAggregateArgs>): Prisma.PrismaPromise<GetTranscriptSegmentAggregateType<T>>

    /**
     * Group by TranscriptSegment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptSegmentGroupByArgs} args - Group by arguments.
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
      T extends TranscriptSegmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptSegmentGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptSegmentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TranscriptSegmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptSegmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TranscriptSegment model
   */
  readonly fields: TranscriptSegmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TranscriptSegment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptSegmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    transcript<T extends TranscriptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TranscriptDefaultArgs<ExtArgs>>): Prisma__TranscriptClient<$Result.GetResult<Prisma.$TranscriptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the TranscriptSegment model
   */
  interface TranscriptSegmentFieldRefs {
    readonly id: FieldRef<"TranscriptSegment", 'String'>
    readonly transcriptId: FieldRef<"TranscriptSegment", 'String'>
    readonly speaker: FieldRef<"TranscriptSegment", 'String'>
    readonly startTime: FieldRef<"TranscriptSegment", 'Float'>
    readonly endTime: FieldRef<"TranscriptSegment", 'Float'>
    readonly text: FieldRef<"TranscriptSegment", 'String'>
    readonly confidence: FieldRef<"TranscriptSegment", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * TranscriptSegment findUnique
   */
  export type TranscriptSegmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment findUniqueOrThrow
   */
  export type TranscriptSegmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment findFirst
   */
  export type TranscriptSegmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment findFirstOrThrow
   */
  export type TranscriptSegmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegment to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment findMany
   */
  export type TranscriptSegmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptSegments to fetch.
     */
    where?: TranscriptSegmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptSegments to fetch.
     */
    orderBy?: TranscriptSegmentOrderByWithRelationInput | TranscriptSegmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TranscriptSegments.
     */
    cursor?: TranscriptSegmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptSegments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptSegments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptSegments.
     */
    distinct?: TranscriptSegmentScalarFieldEnum | TranscriptSegmentScalarFieldEnum[]
  }

  /**
   * TranscriptSegment create
   */
  export type TranscriptSegmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The data needed to create a TranscriptSegment.
     */
    data: XOR<TranscriptSegmentCreateInput, TranscriptSegmentUncheckedCreateInput>
  }

  /**
   * TranscriptSegment createMany
   */
  export type TranscriptSegmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TranscriptSegments.
     */
    data: TranscriptSegmentCreateManyInput | TranscriptSegmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TranscriptSegment createManyAndReturn
   */
  export type TranscriptSegmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * The data used to create many TranscriptSegments.
     */
    data: TranscriptSegmentCreateManyInput | TranscriptSegmentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TranscriptSegment update
   */
  export type TranscriptSegmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The data needed to update a TranscriptSegment.
     */
    data: XOR<TranscriptSegmentUpdateInput, TranscriptSegmentUncheckedUpdateInput>
    /**
     * Choose, which TranscriptSegment to update.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment updateMany
   */
  export type TranscriptSegmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TranscriptSegments.
     */
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyInput>
    /**
     * Filter which TranscriptSegments to update
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to update.
     */
    limit?: number
  }

  /**
   * TranscriptSegment updateManyAndReturn
   */
  export type TranscriptSegmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * The data used to update TranscriptSegments.
     */
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyInput>
    /**
     * Filter which TranscriptSegments to update
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TranscriptSegment upsert
   */
  export type TranscriptSegmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * The filter to search for the TranscriptSegment to update in case it exists.
     */
    where: TranscriptSegmentWhereUniqueInput
    /**
     * In case the TranscriptSegment found by the `where` argument doesn't exist, create a new TranscriptSegment with this data.
     */
    create: XOR<TranscriptSegmentCreateInput, TranscriptSegmentUncheckedCreateInput>
    /**
     * In case the TranscriptSegment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptSegmentUpdateInput, TranscriptSegmentUncheckedUpdateInput>
  }

  /**
   * TranscriptSegment delete
   */
  export type TranscriptSegmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
    /**
     * Filter which TranscriptSegment to delete.
     */
    where: TranscriptSegmentWhereUniqueInput
  }

  /**
   * TranscriptSegment deleteMany
   */
  export type TranscriptSegmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptSegments to delete
     */
    where?: TranscriptSegmentWhereInput
    /**
     * Limit how many TranscriptSegments to delete.
     */
    limit?: number
  }

  /**
   * TranscriptSegment without action
   */
  export type TranscriptSegmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptSegment
     */
    select?: TranscriptSegmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TranscriptSegment
     */
    omit?: TranscriptSegmentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptSegmentInclude<ExtArgs> | null
  }


  /**
   * Model Mom
   */

  export type AggregateMom = {
    _count: MomCountAggregateOutputType | null
    _min: MomMinAggregateOutputType | null
    _max: MomMaxAggregateOutputType | null
  }

  export type MomMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    title: string | null
    dateTime: string | null
    approved: boolean | null
    approvedBy: string | null
    approvedAt: Date | null
    shared: boolean | null
    lastEditedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MomMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    title: string | null
    dateTime: string | null
    approved: boolean | null
    approvedBy: string | null
    approvedAt: Date | null
    shared: boolean | null
    lastEditedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MomCountAggregateOutputType = {
    id: number
    meetingId: number
    title: number
    dateTime: number
    participants: number
    keyPoints: number
    actionItems: number
    approved: number
    approvedBy: number
    approvedAt: number
    shared: number
    lastEditedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MomMinAggregateInputType = {
    id?: true
    meetingId?: true
    title?: true
    dateTime?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
    shared?: true
    lastEditedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MomMaxAggregateInputType = {
    id?: true
    meetingId?: true
    title?: true
    dateTime?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
    shared?: true
    lastEditedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MomCountAggregateInputType = {
    id?: true
    meetingId?: true
    title?: true
    dateTime?: true
    participants?: true
    keyPoints?: true
    actionItems?: true
    approved?: true
    approvedBy?: true
    approvedAt?: true
    shared?: true
    lastEditedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MomAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mom to aggregate.
     */
    where?: MomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moms to fetch.
     */
    orderBy?: MomOrderByWithRelationInput | MomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Moms
    **/
    _count?: true | MomCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MomMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MomMaxAggregateInputType
  }

  export type GetMomAggregateType<T extends MomAggregateArgs> = {
        [P in keyof T & keyof AggregateMom]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMom[P]>
      : GetScalarType<T[P], AggregateMom[P]>
  }




  export type MomGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MomWhereInput
    orderBy?: MomOrderByWithAggregationInput | MomOrderByWithAggregationInput[]
    by: MomScalarFieldEnum[] | MomScalarFieldEnum
    having?: MomScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MomCountAggregateInputType | true
    _min?: MomMinAggregateInputType
    _max?: MomMaxAggregateInputType
  }

  export type MomGroupByOutputType = {
    id: string
    meetingId: string
    title: string
    dateTime: string
    participants: JsonValue
    keyPoints: JsonValue
    actionItems: JsonValue
    approved: boolean
    approvedBy: string | null
    approvedAt: Date | null
    shared: boolean
    lastEditedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: MomCountAggregateOutputType | null
    _min: MomMinAggregateOutputType | null
    _max: MomMaxAggregateOutputType | null
  }

  type GetMomGroupByPayload<T extends MomGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MomGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MomGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MomGroupByOutputType[P]>
            : GetScalarType<T[P], MomGroupByOutputType[P]>
        }
      >
    >


  export type MomSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    title?: boolean
    dateTime?: boolean
    participants?: boolean
    keyPoints?: boolean
    actionItems?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    shared?: boolean
    lastEditedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mom"]>

  export type MomSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    title?: boolean
    dateTime?: boolean
    participants?: boolean
    keyPoints?: boolean
    actionItems?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    shared?: boolean
    lastEditedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mom"]>

  export type MomSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    title?: boolean
    dateTime?: boolean
    participants?: boolean
    keyPoints?: boolean
    actionItems?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    shared?: boolean
    lastEditedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mom"]>

  export type MomSelectScalar = {
    id?: boolean
    meetingId?: boolean
    title?: boolean
    dateTime?: boolean
    participants?: boolean
    keyPoints?: boolean
    actionItems?: boolean
    approved?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    shared?: boolean
    lastEditedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MomOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "title" | "dateTime" | "participants" | "keyPoints" | "actionItems" | "approved" | "approvedBy" | "approvedAt" | "shared" | "lastEditedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["mom"]>
  export type MomInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MomIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type MomIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $MomPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mom"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      title: string
      dateTime: string
      participants: Prisma.JsonValue
      keyPoints: Prisma.JsonValue
      actionItems: Prisma.JsonValue
      approved: boolean
      approvedBy: string | null
      approvedAt: Date | null
      shared: boolean
      lastEditedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mom"]>
    composites: {}
  }

  type MomGetPayload<S extends boolean | null | undefined | MomDefaultArgs> = $Result.GetResult<Prisma.$MomPayload, S>

  type MomCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MomFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MomCountAggregateInputType | true
    }

  export interface MomDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mom'], meta: { name: 'Mom' } }
    /**
     * Find zero or one Mom that matches the filter.
     * @param {MomFindUniqueArgs} args - Arguments to find a Mom
     * @example
     * // Get one Mom
     * const mom = await prisma.mom.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MomFindUniqueArgs>(args: SelectSubset<T, MomFindUniqueArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mom that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MomFindUniqueOrThrowArgs} args - Arguments to find a Mom
     * @example
     * // Get one Mom
     * const mom = await prisma.mom.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MomFindUniqueOrThrowArgs>(args: SelectSubset<T, MomFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mom that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomFindFirstArgs} args - Arguments to find a Mom
     * @example
     * // Get one Mom
     * const mom = await prisma.mom.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MomFindFirstArgs>(args?: SelectSubset<T, MomFindFirstArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mom that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomFindFirstOrThrowArgs} args - Arguments to find a Mom
     * @example
     * // Get one Mom
     * const mom = await prisma.mom.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MomFindFirstOrThrowArgs>(args?: SelectSubset<T, MomFindFirstOrThrowArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Moms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Moms
     * const moms = await prisma.mom.findMany()
     * 
     * // Get first 10 Moms
     * const moms = await prisma.mom.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const momWithIdOnly = await prisma.mom.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MomFindManyArgs>(args?: SelectSubset<T, MomFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mom.
     * @param {MomCreateArgs} args - Arguments to create a Mom.
     * @example
     * // Create one Mom
     * const Mom = await prisma.mom.create({
     *   data: {
     *     // ... data to create a Mom
     *   }
     * })
     * 
     */
    create<T extends MomCreateArgs>(args: SelectSubset<T, MomCreateArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Moms.
     * @param {MomCreateManyArgs} args - Arguments to create many Moms.
     * @example
     * // Create many Moms
     * const mom = await prisma.mom.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MomCreateManyArgs>(args?: SelectSubset<T, MomCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Moms and returns the data saved in the database.
     * @param {MomCreateManyAndReturnArgs} args - Arguments to create many Moms.
     * @example
     * // Create many Moms
     * const mom = await prisma.mom.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Moms and only return the `id`
     * const momWithIdOnly = await prisma.mom.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MomCreateManyAndReturnArgs>(args?: SelectSubset<T, MomCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mom.
     * @param {MomDeleteArgs} args - Arguments to delete one Mom.
     * @example
     * // Delete one Mom
     * const Mom = await prisma.mom.delete({
     *   where: {
     *     // ... filter to delete one Mom
     *   }
     * })
     * 
     */
    delete<T extends MomDeleteArgs>(args: SelectSubset<T, MomDeleteArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mom.
     * @param {MomUpdateArgs} args - Arguments to update one Mom.
     * @example
     * // Update one Mom
     * const mom = await prisma.mom.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MomUpdateArgs>(args: SelectSubset<T, MomUpdateArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Moms.
     * @param {MomDeleteManyArgs} args - Arguments to filter Moms to delete.
     * @example
     * // Delete a few Moms
     * const { count } = await prisma.mom.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MomDeleteManyArgs>(args?: SelectSubset<T, MomDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Moms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Moms
     * const mom = await prisma.mom.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MomUpdateManyArgs>(args: SelectSubset<T, MomUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Moms and returns the data updated in the database.
     * @param {MomUpdateManyAndReturnArgs} args - Arguments to update many Moms.
     * @example
     * // Update many Moms
     * const mom = await prisma.mom.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Moms and only return the `id`
     * const momWithIdOnly = await prisma.mom.updateManyAndReturn({
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
    updateManyAndReturn<T extends MomUpdateManyAndReturnArgs>(args: SelectSubset<T, MomUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mom.
     * @param {MomUpsertArgs} args - Arguments to update or create a Mom.
     * @example
     * // Update or create a Mom
     * const mom = await prisma.mom.upsert({
     *   create: {
     *     // ... data to create a Mom
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mom we want to update
     *   }
     * })
     */
    upsert<T extends MomUpsertArgs>(args: SelectSubset<T, MomUpsertArgs<ExtArgs>>): Prisma__MomClient<$Result.GetResult<Prisma.$MomPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Moms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomCountArgs} args - Arguments to filter Moms to count.
     * @example
     * // Count the number of Moms
     * const count = await prisma.mom.count({
     *   where: {
     *     // ... the filter for the Moms we want to count
     *   }
     * })
    **/
    count<T extends MomCountArgs>(
      args?: Subset<T, MomCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MomCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MomAggregateArgs>(args: Subset<T, MomAggregateArgs>): Prisma.PrismaPromise<GetMomAggregateType<T>>

    /**
     * Group by Mom.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MomGroupByArgs} args - Group by arguments.
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
      T extends MomGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MomGroupByArgs['orderBy'] }
        : { orderBy?: MomGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MomGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMomGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mom model
   */
  readonly fields: MomFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mom.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MomClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Mom model
   */
  interface MomFieldRefs {
    readonly id: FieldRef<"Mom", 'String'>
    readonly meetingId: FieldRef<"Mom", 'String'>
    readonly title: FieldRef<"Mom", 'String'>
    readonly dateTime: FieldRef<"Mom", 'String'>
    readonly participants: FieldRef<"Mom", 'Json'>
    readonly keyPoints: FieldRef<"Mom", 'Json'>
    readonly actionItems: FieldRef<"Mom", 'Json'>
    readonly approved: FieldRef<"Mom", 'Boolean'>
    readonly approvedBy: FieldRef<"Mom", 'String'>
    readonly approvedAt: FieldRef<"Mom", 'DateTime'>
    readonly shared: FieldRef<"Mom", 'Boolean'>
    readonly lastEditedAt: FieldRef<"Mom", 'DateTime'>
    readonly createdAt: FieldRef<"Mom", 'DateTime'>
    readonly updatedAt: FieldRef<"Mom", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Mom findUnique
   */
  export type MomFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter, which Mom to fetch.
     */
    where: MomWhereUniqueInput
  }

  /**
   * Mom findUniqueOrThrow
   */
  export type MomFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter, which Mom to fetch.
     */
    where: MomWhereUniqueInput
  }

  /**
   * Mom findFirst
   */
  export type MomFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter, which Mom to fetch.
     */
    where?: MomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moms to fetch.
     */
    orderBy?: MomOrderByWithRelationInput | MomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Moms.
     */
    cursor?: MomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Moms.
     */
    distinct?: MomScalarFieldEnum | MomScalarFieldEnum[]
  }

  /**
   * Mom findFirstOrThrow
   */
  export type MomFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter, which Mom to fetch.
     */
    where?: MomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moms to fetch.
     */
    orderBy?: MomOrderByWithRelationInput | MomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Moms.
     */
    cursor?: MomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Moms.
     */
    distinct?: MomScalarFieldEnum | MomScalarFieldEnum[]
  }

  /**
   * Mom findMany
   */
  export type MomFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter, which Moms to fetch.
     */
    where?: MomWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Moms to fetch.
     */
    orderBy?: MomOrderByWithRelationInput | MomOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Moms.
     */
    cursor?: MomWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Moms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Moms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Moms.
     */
    distinct?: MomScalarFieldEnum | MomScalarFieldEnum[]
  }

  /**
   * Mom create
   */
  export type MomCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * The data needed to create a Mom.
     */
    data: XOR<MomCreateInput, MomUncheckedCreateInput>
  }

  /**
   * Mom createMany
   */
  export type MomCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Moms.
     */
    data: MomCreateManyInput | MomCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mom createManyAndReturn
   */
  export type MomCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * The data used to create many Moms.
     */
    data: MomCreateManyInput | MomCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mom update
   */
  export type MomUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * The data needed to update a Mom.
     */
    data: XOR<MomUpdateInput, MomUncheckedUpdateInput>
    /**
     * Choose, which Mom to update.
     */
    where: MomWhereUniqueInput
  }

  /**
   * Mom updateMany
   */
  export type MomUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Moms.
     */
    data: XOR<MomUpdateManyMutationInput, MomUncheckedUpdateManyInput>
    /**
     * Filter which Moms to update
     */
    where?: MomWhereInput
    /**
     * Limit how many Moms to update.
     */
    limit?: number
  }

  /**
   * Mom updateManyAndReturn
   */
  export type MomUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * The data used to update Moms.
     */
    data: XOR<MomUpdateManyMutationInput, MomUncheckedUpdateManyInput>
    /**
     * Filter which Moms to update
     */
    where?: MomWhereInput
    /**
     * Limit how many Moms to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mom upsert
   */
  export type MomUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * The filter to search for the Mom to update in case it exists.
     */
    where: MomWhereUniqueInput
    /**
     * In case the Mom found by the `where` argument doesn't exist, create a new Mom with this data.
     */
    create: XOR<MomCreateInput, MomUncheckedCreateInput>
    /**
     * In case the Mom was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MomUpdateInput, MomUncheckedUpdateInput>
  }

  /**
   * Mom delete
   */
  export type MomDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
    /**
     * Filter which Mom to delete.
     */
    where: MomWhereUniqueInput
  }

  /**
   * Mom deleteMany
   */
  export type MomDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Moms to delete
     */
    where?: MomWhereInput
    /**
     * Limit how many Moms to delete.
     */
    limit?: number
  }

  /**
   * Mom without action
   */
  export type MomDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mom
     */
    select?: MomSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mom
     */
    omit?: MomOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MomInclude<ExtArgs> | null
  }


  /**
   * Model ActionItem
   */

  export type AggregateActionItem = {
    _count: ActionItemCountAggregateOutputType | null
    _avg: ActionItemAvgAggregateOutputType | null
    _sum: ActionItemSumAggregateOutputType | null
    _min: ActionItemMinAggregateOutputType | null
    _max: ActionItemMaxAggregateOutputType | null
  }

  export type ActionItemAvgAggregateOutputType = {
    confidence: number | null
  }

  export type ActionItemSumAggregateOutputType = {
    confidence: number | null
  }

  export type ActionItemMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    description: string | null
    ownerName: string | null
    ownerEmail: string | null
    ownerId: string | null
    dueDate: Date | null
    priority: $Enums.TaskPriority | null
    status: $Enums.TaskStatus | null
    confidence: number | null
    externalId: string | null
    externalUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionItemMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    description: string | null
    ownerName: string | null
    ownerEmail: string | null
    ownerId: string | null
    dueDate: Date | null
    priority: $Enums.TaskPriority | null
    status: $Enums.TaskStatus | null
    confidence: number | null
    externalId: string | null
    externalUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ActionItemCountAggregateOutputType = {
    id: number
    meetingId: number
    description: number
    ownerName: number
    ownerEmail: number
    ownerId: number
    dueDate: number
    priority: number
    status: number
    confidence: number
    externalId: number
    externalUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ActionItemAvgAggregateInputType = {
    confidence?: true
  }

  export type ActionItemSumAggregateInputType = {
    confidence?: true
  }

  export type ActionItemMinAggregateInputType = {
    id?: true
    meetingId?: true
    description?: true
    ownerName?: true
    ownerEmail?: true
    ownerId?: true
    dueDate?: true
    priority?: true
    status?: true
    confidence?: true
    externalId?: true
    externalUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionItemMaxAggregateInputType = {
    id?: true
    meetingId?: true
    description?: true
    ownerName?: true
    ownerEmail?: true
    ownerId?: true
    dueDate?: true
    priority?: true
    status?: true
    confidence?: true
    externalId?: true
    externalUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ActionItemCountAggregateInputType = {
    id?: true
    meetingId?: true
    description?: true
    ownerName?: true
    ownerEmail?: true
    ownerId?: true
    dueDate?: true
    priority?: true
    status?: true
    confidence?: true
    externalId?: true
    externalUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ActionItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionItem to aggregate.
     */
    where?: ActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionItems to fetch.
     */
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ActionItems
    **/
    _count?: true | ActionItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ActionItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ActionItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ActionItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ActionItemMaxAggregateInputType
  }

  export type GetActionItemAggregateType<T extends ActionItemAggregateArgs> = {
        [P in keyof T & keyof AggregateActionItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateActionItem[P]>
      : GetScalarType<T[P], AggregateActionItem[P]>
  }




  export type ActionItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ActionItemWhereInput
    orderBy?: ActionItemOrderByWithAggregationInput | ActionItemOrderByWithAggregationInput[]
    by: ActionItemScalarFieldEnum[] | ActionItemScalarFieldEnum
    having?: ActionItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ActionItemCountAggregateInputType | true
    _avg?: ActionItemAvgAggregateInputType
    _sum?: ActionItemSumAggregateInputType
    _min?: ActionItemMinAggregateInputType
    _max?: ActionItemMaxAggregateInputType
  }

  export type ActionItemGroupByOutputType = {
    id: string
    meetingId: string
    description: string
    ownerName: string | null
    ownerEmail: string | null
    ownerId: string | null
    dueDate: Date | null
    priority: $Enums.TaskPriority
    status: $Enums.TaskStatus
    confidence: number | null
    externalId: string | null
    externalUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: ActionItemCountAggregateOutputType | null
    _avg: ActionItemAvgAggregateOutputType | null
    _sum: ActionItemSumAggregateOutputType | null
    _min: ActionItemMinAggregateOutputType | null
    _max: ActionItemMaxAggregateOutputType | null
  }

  type GetActionItemGroupByPayload<T extends ActionItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ActionItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ActionItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ActionItemGroupByOutputType[P]>
            : GetScalarType<T[P], ActionItemGroupByOutputType[P]>
        }
      >
    >


  export type ActionItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    description?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerId?: boolean
    dueDate?: boolean
    priority?: boolean
    status?: boolean
    confidence?: boolean
    externalId?: boolean
    externalUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["actionItem"]>

  export type ActionItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    description?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerId?: boolean
    dueDate?: boolean
    priority?: boolean
    status?: boolean
    confidence?: boolean
    externalId?: boolean
    externalUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["actionItem"]>

  export type ActionItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    description?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerId?: boolean
    dueDate?: boolean
    priority?: boolean
    status?: boolean
    confidence?: boolean
    externalId?: boolean
    externalUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }, ExtArgs["result"]["actionItem"]>

  export type ActionItemSelectScalar = {
    id?: boolean
    meetingId?: boolean
    description?: boolean
    ownerName?: boolean
    ownerEmail?: boolean
    ownerId?: boolean
    dueDate?: boolean
    priority?: boolean
    status?: boolean
    confidence?: boolean
    externalId?: boolean
    externalUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ActionItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "description" | "ownerName" | "ownerEmail" | "ownerId" | "dueDate" | "priority" | "status" | "confidence" | "externalId" | "externalUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["actionItem"]>
  export type ActionItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }
  export type ActionItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }
  export type ActionItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
    owner?: boolean | ActionItem$ownerArgs<ExtArgs>
  }

  export type $ActionItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ActionItem"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
      owner: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      description: string
      ownerName: string | null
      ownerEmail: string | null
      ownerId: string | null
      dueDate: Date | null
      priority: $Enums.TaskPriority
      status: $Enums.TaskStatus
      confidence: number | null
      externalId: string | null
      externalUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["actionItem"]>
    composites: {}
  }

  type ActionItemGetPayload<S extends boolean | null | undefined | ActionItemDefaultArgs> = $Result.GetResult<Prisma.$ActionItemPayload, S>

  type ActionItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ActionItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ActionItemCountAggregateInputType | true
    }

  export interface ActionItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ActionItem'], meta: { name: 'ActionItem' } }
    /**
     * Find zero or one ActionItem that matches the filter.
     * @param {ActionItemFindUniqueArgs} args - Arguments to find a ActionItem
     * @example
     * // Get one ActionItem
     * const actionItem = await prisma.actionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ActionItemFindUniqueArgs>(args: SelectSubset<T, ActionItemFindUniqueArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ActionItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ActionItemFindUniqueOrThrowArgs} args - Arguments to find a ActionItem
     * @example
     * // Get one ActionItem
     * const actionItem = await prisma.actionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ActionItemFindUniqueOrThrowArgs>(args: SelectSubset<T, ActionItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemFindFirstArgs} args - Arguments to find a ActionItem
     * @example
     * // Get one ActionItem
     * const actionItem = await prisma.actionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ActionItemFindFirstArgs>(args?: SelectSubset<T, ActionItemFindFirstArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ActionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemFindFirstOrThrowArgs} args - Arguments to find a ActionItem
     * @example
     * // Get one ActionItem
     * const actionItem = await prisma.actionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ActionItemFindFirstOrThrowArgs>(args?: SelectSubset<T, ActionItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ActionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ActionItems
     * const actionItems = await prisma.actionItem.findMany()
     * 
     * // Get first 10 ActionItems
     * const actionItems = await prisma.actionItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const actionItemWithIdOnly = await prisma.actionItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ActionItemFindManyArgs>(args?: SelectSubset<T, ActionItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ActionItem.
     * @param {ActionItemCreateArgs} args - Arguments to create a ActionItem.
     * @example
     * // Create one ActionItem
     * const ActionItem = await prisma.actionItem.create({
     *   data: {
     *     // ... data to create a ActionItem
     *   }
     * })
     * 
     */
    create<T extends ActionItemCreateArgs>(args: SelectSubset<T, ActionItemCreateArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ActionItems.
     * @param {ActionItemCreateManyArgs} args - Arguments to create many ActionItems.
     * @example
     * // Create many ActionItems
     * const actionItem = await prisma.actionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ActionItemCreateManyArgs>(args?: SelectSubset<T, ActionItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ActionItems and returns the data saved in the database.
     * @param {ActionItemCreateManyAndReturnArgs} args - Arguments to create many ActionItems.
     * @example
     * // Create many ActionItems
     * const actionItem = await prisma.actionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ActionItems and only return the `id`
     * const actionItemWithIdOnly = await prisma.actionItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ActionItemCreateManyAndReturnArgs>(args?: SelectSubset<T, ActionItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ActionItem.
     * @param {ActionItemDeleteArgs} args - Arguments to delete one ActionItem.
     * @example
     * // Delete one ActionItem
     * const ActionItem = await prisma.actionItem.delete({
     *   where: {
     *     // ... filter to delete one ActionItem
     *   }
     * })
     * 
     */
    delete<T extends ActionItemDeleteArgs>(args: SelectSubset<T, ActionItemDeleteArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ActionItem.
     * @param {ActionItemUpdateArgs} args - Arguments to update one ActionItem.
     * @example
     * // Update one ActionItem
     * const actionItem = await prisma.actionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ActionItemUpdateArgs>(args: SelectSubset<T, ActionItemUpdateArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ActionItems.
     * @param {ActionItemDeleteManyArgs} args - Arguments to filter ActionItems to delete.
     * @example
     * // Delete a few ActionItems
     * const { count } = await prisma.actionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ActionItemDeleteManyArgs>(args?: SelectSubset<T, ActionItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ActionItems
     * const actionItem = await prisma.actionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ActionItemUpdateManyArgs>(args: SelectSubset<T, ActionItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ActionItems and returns the data updated in the database.
     * @param {ActionItemUpdateManyAndReturnArgs} args - Arguments to update many ActionItems.
     * @example
     * // Update many ActionItems
     * const actionItem = await prisma.actionItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ActionItems and only return the `id`
     * const actionItemWithIdOnly = await prisma.actionItem.updateManyAndReturn({
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
    updateManyAndReturn<T extends ActionItemUpdateManyAndReturnArgs>(args: SelectSubset<T, ActionItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ActionItem.
     * @param {ActionItemUpsertArgs} args - Arguments to update or create a ActionItem.
     * @example
     * // Update or create a ActionItem
     * const actionItem = await prisma.actionItem.upsert({
     *   create: {
     *     // ... data to create a ActionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ActionItem we want to update
     *   }
     * })
     */
    upsert<T extends ActionItemUpsertArgs>(args: SelectSubset<T, ActionItemUpsertArgs<ExtArgs>>): Prisma__ActionItemClient<$Result.GetResult<Prisma.$ActionItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ActionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemCountArgs} args - Arguments to filter ActionItems to count.
     * @example
     * // Count the number of ActionItems
     * const count = await prisma.actionItem.count({
     *   where: {
     *     // ... the filter for the ActionItems we want to count
     *   }
     * })
    **/
    count<T extends ActionItemCountArgs>(
      args?: Subset<T, ActionItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ActionItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ActionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ActionItemAggregateArgs>(args: Subset<T, ActionItemAggregateArgs>): Prisma.PrismaPromise<GetActionItemAggregateType<T>>

    /**
     * Group by ActionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ActionItemGroupByArgs} args - Group by arguments.
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
      T extends ActionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ActionItemGroupByArgs['orderBy'] }
        : { orderBy?: ActionItemGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ActionItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetActionItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ActionItem model
   */
  readonly fields: ActionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ActionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ActionItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    owner<T extends ActionItem$ownerArgs<ExtArgs> = {}>(args?: Subset<T, ActionItem$ownerArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ActionItem model
   */
  interface ActionItemFieldRefs {
    readonly id: FieldRef<"ActionItem", 'String'>
    readonly meetingId: FieldRef<"ActionItem", 'String'>
    readonly description: FieldRef<"ActionItem", 'String'>
    readonly ownerName: FieldRef<"ActionItem", 'String'>
    readonly ownerEmail: FieldRef<"ActionItem", 'String'>
    readonly ownerId: FieldRef<"ActionItem", 'String'>
    readonly dueDate: FieldRef<"ActionItem", 'DateTime'>
    readonly priority: FieldRef<"ActionItem", 'TaskPriority'>
    readonly status: FieldRef<"ActionItem", 'TaskStatus'>
    readonly confidence: FieldRef<"ActionItem", 'Float'>
    readonly externalId: FieldRef<"ActionItem", 'String'>
    readonly externalUrl: FieldRef<"ActionItem", 'String'>
    readonly createdAt: FieldRef<"ActionItem", 'DateTime'>
    readonly updatedAt: FieldRef<"ActionItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ActionItem findUnique
   */
  export type ActionItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter, which ActionItem to fetch.
     */
    where: ActionItemWhereUniqueInput
  }

  /**
   * ActionItem findUniqueOrThrow
   */
  export type ActionItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter, which ActionItem to fetch.
     */
    where: ActionItemWhereUniqueInput
  }

  /**
   * ActionItem findFirst
   */
  export type ActionItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter, which ActionItem to fetch.
     */
    where?: ActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionItems to fetch.
     */
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionItems.
     */
    cursor?: ActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionItems.
     */
    distinct?: ActionItemScalarFieldEnum | ActionItemScalarFieldEnum[]
  }

  /**
   * ActionItem findFirstOrThrow
   */
  export type ActionItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter, which ActionItem to fetch.
     */
    where?: ActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionItems to fetch.
     */
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ActionItems.
     */
    cursor?: ActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionItems.
     */
    distinct?: ActionItemScalarFieldEnum | ActionItemScalarFieldEnum[]
  }

  /**
   * ActionItem findMany
   */
  export type ActionItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter, which ActionItems to fetch.
     */
    where?: ActionItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ActionItems to fetch.
     */
    orderBy?: ActionItemOrderByWithRelationInput | ActionItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ActionItems.
     */
    cursor?: ActionItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ActionItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ActionItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ActionItems.
     */
    distinct?: ActionItemScalarFieldEnum | ActionItemScalarFieldEnum[]
  }

  /**
   * ActionItem create
   */
  export type ActionItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * The data needed to create a ActionItem.
     */
    data: XOR<ActionItemCreateInput, ActionItemUncheckedCreateInput>
  }

  /**
   * ActionItem createMany
   */
  export type ActionItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ActionItems.
     */
    data: ActionItemCreateManyInput | ActionItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ActionItem createManyAndReturn
   */
  export type ActionItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * The data used to create many ActionItems.
     */
    data: ActionItemCreateManyInput | ActionItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionItem update
   */
  export type ActionItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * The data needed to update a ActionItem.
     */
    data: XOR<ActionItemUpdateInput, ActionItemUncheckedUpdateInput>
    /**
     * Choose, which ActionItem to update.
     */
    where: ActionItemWhereUniqueInput
  }

  /**
   * ActionItem updateMany
   */
  export type ActionItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ActionItems.
     */
    data: XOR<ActionItemUpdateManyMutationInput, ActionItemUncheckedUpdateManyInput>
    /**
     * Filter which ActionItems to update
     */
    where?: ActionItemWhereInput
    /**
     * Limit how many ActionItems to update.
     */
    limit?: number
  }

  /**
   * ActionItem updateManyAndReturn
   */
  export type ActionItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * The data used to update ActionItems.
     */
    data: XOR<ActionItemUpdateManyMutationInput, ActionItemUncheckedUpdateManyInput>
    /**
     * Filter which ActionItems to update
     */
    where?: ActionItemWhereInput
    /**
     * Limit how many ActionItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ActionItem upsert
   */
  export type ActionItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * The filter to search for the ActionItem to update in case it exists.
     */
    where: ActionItemWhereUniqueInput
    /**
     * In case the ActionItem found by the `where` argument doesn't exist, create a new ActionItem with this data.
     */
    create: XOR<ActionItemCreateInput, ActionItemUncheckedCreateInput>
    /**
     * In case the ActionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ActionItemUpdateInput, ActionItemUncheckedUpdateInput>
  }

  /**
   * ActionItem delete
   */
  export type ActionItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
    /**
     * Filter which ActionItem to delete.
     */
    where: ActionItemWhereUniqueInput
  }

  /**
   * ActionItem deleteMany
   */
  export type ActionItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ActionItems to delete
     */
    where?: ActionItemWhereInput
    /**
     * Limit how many ActionItems to delete.
     */
    limit?: number
  }

  /**
   * ActionItem.owner
   */
  export type ActionItem$ownerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * ActionItem without action
   */
  export type ActionItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ActionItem
     */
    select?: ActionItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ActionItem
     */
    omit?: ActionItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ActionItemInclude<ExtArgs> | null
  }


  /**
   * Model Decision
   */

  export type AggregateDecision = {
    _count: DecisionCountAggregateOutputType | null
    _avg: DecisionAvgAggregateOutputType | null
    _sum: DecisionSumAggregateOutputType | null
    _min: DecisionMinAggregateOutputType | null
    _max: DecisionMaxAggregateOutputType | null
  }

  export type DecisionAvgAggregateOutputType = {
    timestamp: number | null
  }

  export type DecisionSumAggregateOutputType = {
    timestamp: number | null
  }

  export type DecisionMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    text: string | null
    timestamp: number | null
    createdAt: Date | null
  }

  export type DecisionMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    text: string | null
    timestamp: number | null
    createdAt: Date | null
  }

  export type DecisionCountAggregateOutputType = {
    id: number
    meetingId: number
    text: number
    timestamp: number
    createdAt: number
    _all: number
  }


  export type DecisionAvgAggregateInputType = {
    timestamp?: true
  }

  export type DecisionSumAggregateInputType = {
    timestamp?: true
  }

  export type DecisionMinAggregateInputType = {
    id?: true
    meetingId?: true
    text?: true
    timestamp?: true
    createdAt?: true
  }

  export type DecisionMaxAggregateInputType = {
    id?: true
    meetingId?: true
    text?: true
    timestamp?: true
    createdAt?: true
  }

  export type DecisionCountAggregateInputType = {
    id?: true
    meetingId?: true
    text?: true
    timestamp?: true
    createdAt?: true
    _all?: true
  }

  export type DecisionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Decision to aggregate.
     */
    where?: DecisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decisions to fetch.
     */
    orderBy?: DecisionOrderByWithRelationInput | DecisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DecisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Decisions
    **/
    _count?: true | DecisionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DecisionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DecisionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DecisionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DecisionMaxAggregateInputType
  }

  export type GetDecisionAggregateType<T extends DecisionAggregateArgs> = {
        [P in keyof T & keyof AggregateDecision]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDecision[P]>
      : GetScalarType<T[P], AggregateDecision[P]>
  }




  export type DecisionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DecisionWhereInput
    orderBy?: DecisionOrderByWithAggregationInput | DecisionOrderByWithAggregationInput[]
    by: DecisionScalarFieldEnum[] | DecisionScalarFieldEnum
    having?: DecisionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DecisionCountAggregateInputType | true
    _avg?: DecisionAvgAggregateInputType
    _sum?: DecisionSumAggregateInputType
    _min?: DecisionMinAggregateInputType
    _max?: DecisionMaxAggregateInputType
  }

  export type DecisionGroupByOutputType = {
    id: string
    meetingId: string
    text: string
    timestamp: number | null
    createdAt: Date
    _count: DecisionCountAggregateOutputType | null
    _avg: DecisionAvgAggregateOutputType | null
    _sum: DecisionSumAggregateOutputType | null
    _min: DecisionMinAggregateOutputType | null
    _max: DecisionMaxAggregateOutputType | null
  }

  type GetDecisionGroupByPayload<T extends DecisionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DecisionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DecisionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DecisionGroupByOutputType[P]>
            : GetScalarType<T[P], DecisionGroupByOutputType[P]>
        }
      >
    >


  export type DecisionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    text?: boolean
    timestamp?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["decision"]>

  export type DecisionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    text?: boolean
    timestamp?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["decision"]>

  export type DecisionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    text?: boolean
    timestamp?: boolean
    createdAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["decision"]>

  export type DecisionSelectScalar = {
    id?: boolean
    meetingId?: boolean
    text?: boolean
    timestamp?: boolean
    createdAt?: boolean
  }

  export type DecisionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "text" | "timestamp" | "createdAt", ExtArgs["result"]["decision"]>
  export type DecisionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type DecisionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type DecisionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $DecisionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Decision"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      text: string
      timestamp: number | null
      createdAt: Date
    }, ExtArgs["result"]["decision"]>
    composites: {}
  }

  type DecisionGetPayload<S extends boolean | null | undefined | DecisionDefaultArgs> = $Result.GetResult<Prisma.$DecisionPayload, S>

  type DecisionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DecisionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DecisionCountAggregateInputType | true
    }

  export interface DecisionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Decision'], meta: { name: 'Decision' } }
    /**
     * Find zero or one Decision that matches the filter.
     * @param {DecisionFindUniqueArgs} args - Arguments to find a Decision
     * @example
     * // Get one Decision
     * const decision = await prisma.decision.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DecisionFindUniqueArgs>(args: SelectSubset<T, DecisionFindUniqueArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Decision that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DecisionFindUniqueOrThrowArgs} args - Arguments to find a Decision
     * @example
     * // Get one Decision
     * const decision = await prisma.decision.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DecisionFindUniqueOrThrowArgs>(args: SelectSubset<T, DecisionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Decision that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionFindFirstArgs} args - Arguments to find a Decision
     * @example
     * // Get one Decision
     * const decision = await prisma.decision.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DecisionFindFirstArgs>(args?: SelectSubset<T, DecisionFindFirstArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Decision that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionFindFirstOrThrowArgs} args - Arguments to find a Decision
     * @example
     * // Get one Decision
     * const decision = await prisma.decision.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DecisionFindFirstOrThrowArgs>(args?: SelectSubset<T, DecisionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Decisions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Decisions
     * const decisions = await prisma.decision.findMany()
     * 
     * // Get first 10 Decisions
     * const decisions = await prisma.decision.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const decisionWithIdOnly = await prisma.decision.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DecisionFindManyArgs>(args?: SelectSubset<T, DecisionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Decision.
     * @param {DecisionCreateArgs} args - Arguments to create a Decision.
     * @example
     * // Create one Decision
     * const Decision = await prisma.decision.create({
     *   data: {
     *     // ... data to create a Decision
     *   }
     * })
     * 
     */
    create<T extends DecisionCreateArgs>(args: SelectSubset<T, DecisionCreateArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Decisions.
     * @param {DecisionCreateManyArgs} args - Arguments to create many Decisions.
     * @example
     * // Create many Decisions
     * const decision = await prisma.decision.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DecisionCreateManyArgs>(args?: SelectSubset<T, DecisionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Decisions and returns the data saved in the database.
     * @param {DecisionCreateManyAndReturnArgs} args - Arguments to create many Decisions.
     * @example
     * // Create many Decisions
     * const decision = await prisma.decision.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Decisions and only return the `id`
     * const decisionWithIdOnly = await prisma.decision.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DecisionCreateManyAndReturnArgs>(args?: SelectSubset<T, DecisionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Decision.
     * @param {DecisionDeleteArgs} args - Arguments to delete one Decision.
     * @example
     * // Delete one Decision
     * const Decision = await prisma.decision.delete({
     *   where: {
     *     // ... filter to delete one Decision
     *   }
     * })
     * 
     */
    delete<T extends DecisionDeleteArgs>(args: SelectSubset<T, DecisionDeleteArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Decision.
     * @param {DecisionUpdateArgs} args - Arguments to update one Decision.
     * @example
     * // Update one Decision
     * const decision = await prisma.decision.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DecisionUpdateArgs>(args: SelectSubset<T, DecisionUpdateArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Decisions.
     * @param {DecisionDeleteManyArgs} args - Arguments to filter Decisions to delete.
     * @example
     * // Delete a few Decisions
     * const { count } = await prisma.decision.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DecisionDeleteManyArgs>(args?: SelectSubset<T, DecisionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Decisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Decisions
     * const decision = await prisma.decision.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DecisionUpdateManyArgs>(args: SelectSubset<T, DecisionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Decisions and returns the data updated in the database.
     * @param {DecisionUpdateManyAndReturnArgs} args - Arguments to update many Decisions.
     * @example
     * // Update many Decisions
     * const decision = await prisma.decision.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Decisions and only return the `id`
     * const decisionWithIdOnly = await prisma.decision.updateManyAndReturn({
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
    updateManyAndReturn<T extends DecisionUpdateManyAndReturnArgs>(args: SelectSubset<T, DecisionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Decision.
     * @param {DecisionUpsertArgs} args - Arguments to update or create a Decision.
     * @example
     * // Update or create a Decision
     * const decision = await prisma.decision.upsert({
     *   create: {
     *     // ... data to create a Decision
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Decision we want to update
     *   }
     * })
     */
    upsert<T extends DecisionUpsertArgs>(args: SelectSubset<T, DecisionUpsertArgs<ExtArgs>>): Prisma__DecisionClient<$Result.GetResult<Prisma.$DecisionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Decisions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionCountArgs} args - Arguments to filter Decisions to count.
     * @example
     * // Count the number of Decisions
     * const count = await prisma.decision.count({
     *   where: {
     *     // ... the filter for the Decisions we want to count
     *   }
     * })
    **/
    count<T extends DecisionCountArgs>(
      args?: Subset<T, DecisionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DecisionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Decision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DecisionAggregateArgs>(args: Subset<T, DecisionAggregateArgs>): Prisma.PrismaPromise<GetDecisionAggregateType<T>>

    /**
     * Group by Decision.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DecisionGroupByArgs} args - Group by arguments.
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
      T extends DecisionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DecisionGroupByArgs['orderBy'] }
        : { orderBy?: DecisionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DecisionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDecisionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Decision model
   */
  readonly fields: DecisionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Decision.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DecisionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Decision model
   */
  interface DecisionFieldRefs {
    readonly id: FieldRef<"Decision", 'String'>
    readonly meetingId: FieldRef<"Decision", 'String'>
    readonly text: FieldRef<"Decision", 'String'>
    readonly timestamp: FieldRef<"Decision", 'Float'>
    readonly createdAt: FieldRef<"Decision", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Decision findUnique
   */
  export type DecisionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter, which Decision to fetch.
     */
    where: DecisionWhereUniqueInput
  }

  /**
   * Decision findUniqueOrThrow
   */
  export type DecisionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter, which Decision to fetch.
     */
    where: DecisionWhereUniqueInput
  }

  /**
   * Decision findFirst
   */
  export type DecisionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter, which Decision to fetch.
     */
    where?: DecisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decisions to fetch.
     */
    orderBy?: DecisionOrderByWithRelationInput | DecisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Decisions.
     */
    cursor?: DecisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Decisions.
     */
    distinct?: DecisionScalarFieldEnum | DecisionScalarFieldEnum[]
  }

  /**
   * Decision findFirstOrThrow
   */
  export type DecisionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter, which Decision to fetch.
     */
    where?: DecisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decisions to fetch.
     */
    orderBy?: DecisionOrderByWithRelationInput | DecisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Decisions.
     */
    cursor?: DecisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Decisions.
     */
    distinct?: DecisionScalarFieldEnum | DecisionScalarFieldEnum[]
  }

  /**
   * Decision findMany
   */
  export type DecisionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter, which Decisions to fetch.
     */
    where?: DecisionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Decisions to fetch.
     */
    orderBy?: DecisionOrderByWithRelationInput | DecisionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Decisions.
     */
    cursor?: DecisionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Decisions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Decisions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Decisions.
     */
    distinct?: DecisionScalarFieldEnum | DecisionScalarFieldEnum[]
  }

  /**
   * Decision create
   */
  export type DecisionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * The data needed to create a Decision.
     */
    data: XOR<DecisionCreateInput, DecisionUncheckedCreateInput>
  }

  /**
   * Decision createMany
   */
  export type DecisionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Decisions.
     */
    data: DecisionCreateManyInput | DecisionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Decision createManyAndReturn
   */
  export type DecisionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * The data used to create many Decisions.
     */
    data: DecisionCreateManyInput | DecisionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Decision update
   */
  export type DecisionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * The data needed to update a Decision.
     */
    data: XOR<DecisionUpdateInput, DecisionUncheckedUpdateInput>
    /**
     * Choose, which Decision to update.
     */
    where: DecisionWhereUniqueInput
  }

  /**
   * Decision updateMany
   */
  export type DecisionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Decisions.
     */
    data: XOR<DecisionUpdateManyMutationInput, DecisionUncheckedUpdateManyInput>
    /**
     * Filter which Decisions to update
     */
    where?: DecisionWhereInput
    /**
     * Limit how many Decisions to update.
     */
    limit?: number
  }

  /**
   * Decision updateManyAndReturn
   */
  export type DecisionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * The data used to update Decisions.
     */
    data: XOR<DecisionUpdateManyMutationInput, DecisionUncheckedUpdateManyInput>
    /**
     * Filter which Decisions to update
     */
    where?: DecisionWhereInput
    /**
     * Limit how many Decisions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Decision upsert
   */
  export type DecisionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * The filter to search for the Decision to update in case it exists.
     */
    where: DecisionWhereUniqueInput
    /**
     * In case the Decision found by the `where` argument doesn't exist, create a new Decision with this data.
     */
    create: XOR<DecisionCreateInput, DecisionUncheckedCreateInput>
    /**
     * In case the Decision was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DecisionUpdateInput, DecisionUncheckedUpdateInput>
  }

  /**
   * Decision delete
   */
  export type DecisionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
    /**
     * Filter which Decision to delete.
     */
    where: DecisionWhereUniqueInput
  }

  /**
   * Decision deleteMany
   */
  export type DecisionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Decisions to delete
     */
    where?: DecisionWhereInput
    /**
     * Limit how many Decisions to delete.
     */
    limit?: number
  }

  /**
   * Decision without action
   */
  export type DecisionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Decision
     */
    select?: DecisionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Decision
     */
    omit?: DecisionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DecisionInclude<ExtArgs> | null
  }


  /**
   * Model Summary
   */

  export type AggregateSummary = {
    _count: SummaryCountAggregateOutputType | null
    _min: SummaryMinAggregateOutputType | null
    _max: SummaryMaxAggregateOutputType | null
  }

  export type SummaryMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    shortSummary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SummaryMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    shortSummary: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SummaryCountAggregateOutputType = {
    id: number
    meetingId: number
    shortSummary: number
    nextAgenda: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SummaryMinAggregateInputType = {
    id?: true
    meetingId?: true
    shortSummary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SummaryMaxAggregateInputType = {
    id?: true
    meetingId?: true
    shortSummary?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SummaryCountAggregateInputType = {
    id?: true
    meetingId?: true
    shortSummary?: true
    nextAgenda?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SummaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Summary to aggregate.
     */
    where?: SummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Summaries to fetch.
     */
    orderBy?: SummaryOrderByWithRelationInput | SummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Summaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Summaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Summaries
    **/
    _count?: true | SummaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SummaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SummaryMaxAggregateInputType
  }

  export type GetSummaryAggregateType<T extends SummaryAggregateArgs> = {
        [P in keyof T & keyof AggregateSummary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSummary[P]>
      : GetScalarType<T[P], AggregateSummary[P]>
  }




  export type SummaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SummaryWhereInput
    orderBy?: SummaryOrderByWithAggregationInput | SummaryOrderByWithAggregationInput[]
    by: SummaryScalarFieldEnum[] | SummaryScalarFieldEnum
    having?: SummaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SummaryCountAggregateInputType | true
    _min?: SummaryMinAggregateInputType
    _max?: SummaryMaxAggregateInputType
  }

  export type SummaryGroupByOutputType = {
    id: string
    meetingId: string
    shortSummary: string
    nextAgenda: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: SummaryCountAggregateOutputType | null
    _min: SummaryMinAggregateOutputType | null
    _max: SummaryMaxAggregateOutputType | null
  }

  type GetSummaryGroupByPayload<T extends SummaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SummaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SummaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SummaryGroupByOutputType[P]>
            : GetScalarType<T[P], SummaryGroupByOutputType[P]>
        }
      >
    >


  export type SummarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    shortSummary?: boolean
    nextAgenda?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["summary"]>

  export type SummarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    shortSummary?: boolean
    nextAgenda?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["summary"]>

  export type SummarySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    shortSummary?: boolean
    nextAgenda?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["summary"]>

  export type SummarySelectScalar = {
    id?: boolean
    meetingId?: boolean
    shortSummary?: boolean
    nextAgenda?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SummaryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "shortSummary" | "nextAgenda" | "createdAt" | "updatedAt", ExtArgs["result"]["summary"]>
  export type SummaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type SummaryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }
  export type SummaryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | MeetingDefaultArgs<ExtArgs>
  }

  export type $SummaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Summary"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string
      shortSummary: string
      nextAgenda: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["summary"]>
    composites: {}
  }

  type SummaryGetPayload<S extends boolean | null | undefined | SummaryDefaultArgs> = $Result.GetResult<Prisma.$SummaryPayload, S>

  type SummaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SummaryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SummaryCountAggregateInputType | true
    }

  export interface SummaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Summary'], meta: { name: 'Summary' } }
    /**
     * Find zero or one Summary that matches the filter.
     * @param {SummaryFindUniqueArgs} args - Arguments to find a Summary
     * @example
     * // Get one Summary
     * const summary = await prisma.summary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SummaryFindUniqueArgs>(args: SelectSubset<T, SummaryFindUniqueArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Summary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SummaryFindUniqueOrThrowArgs} args - Arguments to find a Summary
     * @example
     * // Get one Summary
     * const summary = await prisma.summary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SummaryFindUniqueOrThrowArgs>(args: SelectSubset<T, SummaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Summary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryFindFirstArgs} args - Arguments to find a Summary
     * @example
     * // Get one Summary
     * const summary = await prisma.summary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SummaryFindFirstArgs>(args?: SelectSubset<T, SummaryFindFirstArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Summary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryFindFirstOrThrowArgs} args - Arguments to find a Summary
     * @example
     * // Get one Summary
     * const summary = await prisma.summary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SummaryFindFirstOrThrowArgs>(args?: SelectSubset<T, SummaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Summaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Summaries
     * const summaries = await prisma.summary.findMany()
     * 
     * // Get first 10 Summaries
     * const summaries = await prisma.summary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const summaryWithIdOnly = await prisma.summary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SummaryFindManyArgs>(args?: SelectSubset<T, SummaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Summary.
     * @param {SummaryCreateArgs} args - Arguments to create a Summary.
     * @example
     * // Create one Summary
     * const Summary = await prisma.summary.create({
     *   data: {
     *     // ... data to create a Summary
     *   }
     * })
     * 
     */
    create<T extends SummaryCreateArgs>(args: SelectSubset<T, SummaryCreateArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Summaries.
     * @param {SummaryCreateManyArgs} args - Arguments to create many Summaries.
     * @example
     * // Create many Summaries
     * const summary = await prisma.summary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SummaryCreateManyArgs>(args?: SelectSubset<T, SummaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Summaries and returns the data saved in the database.
     * @param {SummaryCreateManyAndReturnArgs} args - Arguments to create many Summaries.
     * @example
     * // Create many Summaries
     * const summary = await prisma.summary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Summaries and only return the `id`
     * const summaryWithIdOnly = await prisma.summary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SummaryCreateManyAndReturnArgs>(args?: SelectSubset<T, SummaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Summary.
     * @param {SummaryDeleteArgs} args - Arguments to delete one Summary.
     * @example
     * // Delete one Summary
     * const Summary = await prisma.summary.delete({
     *   where: {
     *     // ... filter to delete one Summary
     *   }
     * })
     * 
     */
    delete<T extends SummaryDeleteArgs>(args: SelectSubset<T, SummaryDeleteArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Summary.
     * @param {SummaryUpdateArgs} args - Arguments to update one Summary.
     * @example
     * // Update one Summary
     * const summary = await prisma.summary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SummaryUpdateArgs>(args: SelectSubset<T, SummaryUpdateArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Summaries.
     * @param {SummaryDeleteManyArgs} args - Arguments to filter Summaries to delete.
     * @example
     * // Delete a few Summaries
     * const { count } = await prisma.summary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SummaryDeleteManyArgs>(args?: SelectSubset<T, SummaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Summaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Summaries
     * const summary = await prisma.summary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SummaryUpdateManyArgs>(args: SelectSubset<T, SummaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Summaries and returns the data updated in the database.
     * @param {SummaryUpdateManyAndReturnArgs} args - Arguments to update many Summaries.
     * @example
     * // Update many Summaries
     * const summary = await prisma.summary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Summaries and only return the `id`
     * const summaryWithIdOnly = await prisma.summary.updateManyAndReturn({
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
    updateManyAndReturn<T extends SummaryUpdateManyAndReturnArgs>(args: SelectSubset<T, SummaryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Summary.
     * @param {SummaryUpsertArgs} args - Arguments to update or create a Summary.
     * @example
     * // Update or create a Summary
     * const summary = await prisma.summary.upsert({
     *   create: {
     *     // ... data to create a Summary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Summary we want to update
     *   }
     * })
     */
    upsert<T extends SummaryUpsertArgs>(args: SelectSubset<T, SummaryUpsertArgs<ExtArgs>>): Prisma__SummaryClient<$Result.GetResult<Prisma.$SummaryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Summaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryCountArgs} args - Arguments to filter Summaries to count.
     * @example
     * // Count the number of Summaries
     * const count = await prisma.summary.count({
     *   where: {
     *     // ... the filter for the Summaries we want to count
     *   }
     * })
    **/
    count<T extends SummaryCountArgs>(
      args?: Subset<T, SummaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SummaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Summary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SummaryAggregateArgs>(args: Subset<T, SummaryAggregateArgs>): Prisma.PrismaPromise<GetSummaryAggregateType<T>>

    /**
     * Group by Summary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SummaryGroupByArgs} args - Group by arguments.
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
      T extends SummaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SummaryGroupByArgs['orderBy'] }
        : { orderBy?: SummaryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SummaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSummaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Summary model
   */
  readonly fields: SummaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Summary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SummaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends MeetingDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeetingDefaultArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Summary model
   */
  interface SummaryFieldRefs {
    readonly id: FieldRef<"Summary", 'String'>
    readonly meetingId: FieldRef<"Summary", 'String'>
    readonly shortSummary: FieldRef<"Summary", 'String'>
    readonly nextAgenda: FieldRef<"Summary", 'Json'>
    readonly createdAt: FieldRef<"Summary", 'DateTime'>
    readonly updatedAt: FieldRef<"Summary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Summary findUnique
   */
  export type SummaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter, which Summary to fetch.
     */
    where: SummaryWhereUniqueInput
  }

  /**
   * Summary findUniqueOrThrow
   */
  export type SummaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter, which Summary to fetch.
     */
    where: SummaryWhereUniqueInput
  }

  /**
   * Summary findFirst
   */
  export type SummaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter, which Summary to fetch.
     */
    where?: SummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Summaries to fetch.
     */
    orderBy?: SummaryOrderByWithRelationInput | SummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Summaries.
     */
    cursor?: SummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Summaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Summaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Summaries.
     */
    distinct?: SummaryScalarFieldEnum | SummaryScalarFieldEnum[]
  }

  /**
   * Summary findFirstOrThrow
   */
  export type SummaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter, which Summary to fetch.
     */
    where?: SummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Summaries to fetch.
     */
    orderBy?: SummaryOrderByWithRelationInput | SummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Summaries.
     */
    cursor?: SummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Summaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Summaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Summaries.
     */
    distinct?: SummaryScalarFieldEnum | SummaryScalarFieldEnum[]
  }

  /**
   * Summary findMany
   */
  export type SummaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter, which Summaries to fetch.
     */
    where?: SummaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Summaries to fetch.
     */
    orderBy?: SummaryOrderByWithRelationInput | SummaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Summaries.
     */
    cursor?: SummaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Summaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Summaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Summaries.
     */
    distinct?: SummaryScalarFieldEnum | SummaryScalarFieldEnum[]
  }

  /**
   * Summary create
   */
  export type SummaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * The data needed to create a Summary.
     */
    data: XOR<SummaryCreateInput, SummaryUncheckedCreateInput>
  }

  /**
   * Summary createMany
   */
  export type SummaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Summaries.
     */
    data: SummaryCreateManyInput | SummaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Summary createManyAndReturn
   */
  export type SummaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * The data used to create many Summaries.
     */
    data: SummaryCreateManyInput | SummaryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Summary update
   */
  export type SummaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * The data needed to update a Summary.
     */
    data: XOR<SummaryUpdateInput, SummaryUncheckedUpdateInput>
    /**
     * Choose, which Summary to update.
     */
    where: SummaryWhereUniqueInput
  }

  /**
   * Summary updateMany
   */
  export type SummaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Summaries.
     */
    data: XOR<SummaryUpdateManyMutationInput, SummaryUncheckedUpdateManyInput>
    /**
     * Filter which Summaries to update
     */
    where?: SummaryWhereInput
    /**
     * Limit how many Summaries to update.
     */
    limit?: number
  }

  /**
   * Summary updateManyAndReturn
   */
  export type SummaryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * The data used to update Summaries.
     */
    data: XOR<SummaryUpdateManyMutationInput, SummaryUncheckedUpdateManyInput>
    /**
     * Filter which Summaries to update
     */
    where?: SummaryWhereInput
    /**
     * Limit how many Summaries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Summary upsert
   */
  export type SummaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * The filter to search for the Summary to update in case it exists.
     */
    where: SummaryWhereUniqueInput
    /**
     * In case the Summary found by the `where` argument doesn't exist, create a new Summary with this data.
     */
    create: XOR<SummaryCreateInput, SummaryUncheckedCreateInput>
    /**
     * In case the Summary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SummaryUpdateInput, SummaryUncheckedUpdateInput>
  }

  /**
   * Summary delete
   */
  export type SummaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
    /**
     * Filter which Summary to delete.
     */
    where: SummaryWhereUniqueInput
  }

  /**
   * Summary deleteMany
   */
  export type SummaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Summaries to delete
     */
    where?: SummaryWhereInput
    /**
     * Limit how many Summaries to delete.
     */
    limit?: number
  }

  /**
   * Summary without action
   */
  export type SummaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Summary
     */
    select?: SummarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Summary
     */
    omit?: SummaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SummaryInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    meetingId: string | null
    userId: string | null
    action: $Enums.PipelineStep | null
    createdAt: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    meetingId: string | null
    userId: string | null
    action: $Enums.PipelineStep | null
    createdAt: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    meetingId: number
    userId: number
    action: number
    details: number
    createdAt: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    action?: true
    createdAt?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    action?: true
    createdAt?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    meetingId?: true
    userId?: true
    action?: true
    details?: true
    createdAt?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    meetingId: string | null
    userId: string | null
    action: $Enums.PipelineStep
    details: JsonValue | null
    createdAt: Date
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    createdAt?: boolean
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    createdAt?: boolean
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    createdAt?: boolean
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    meetingId?: boolean
    userId?: boolean
    action?: boolean
    details?: boolean
    createdAt?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "meetingId" | "userId" | "action" | "details" | "createdAt", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meeting?: boolean | AuditLog$meetingArgs<ExtArgs>
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      meeting: Prisma.$MeetingPayload<ExtArgs> | null
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      meetingId: string | null
      userId: string | null
      action: $Enums.PipelineStep
      details: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
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
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
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
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    meeting<T extends AuditLog$meetingArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$meetingArgs<ExtArgs>>): Prisma__MeetingClient<$Result.GetResult<Prisma.$MeetingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly meetingId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly action: FieldRef<"AuditLog", 'PipelineStep'>
    readonly details: FieldRef<"AuditLog", 'Json'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.meeting
   */
  export type AuditLog$meetingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Meeting
     */
    select?: MeetingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Meeting
     */
    omit?: MeetingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeetingInclude<ExtArgs> | null
    where?: MeetingWhereInput
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
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
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
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
    email: 'email',
    name: 'name',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MeetingScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    scheduledAt: 'scheduledAt',
    durationMinutes: 'durationMinutes',
    status: 'status',
    tag: 'tag',
    notes: 'notes',
    calendarEventId: 'calendarEventId',
    recordingUrl: 'recordingUrl',
    organizerId: 'organizerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MeetingScalarFieldEnum = (typeof MeetingScalarFieldEnum)[keyof typeof MeetingScalarFieldEnum]


  export const MeetingInviteScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    email: 'email',
    name: 'name',
    status: 'status',
    error: 'error',
    sentAt: 'sentAt'
  };

  export type MeetingInviteScalarFieldEnum = (typeof MeetingInviteScalarFieldEnum)[keyof typeof MeetingInviteScalarFieldEnum]


  export const MeetingParticipantScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    name: 'name',
    email: 'email',
    role: 'role'
  };

  export type MeetingParticipantScalarFieldEnum = (typeof MeetingParticipantScalarFieldEnum)[keyof typeof MeetingParticipantScalarFieldEnum]


  export const AudioFileScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    storageKey: 'storageKey',
    mimeType: 'mimeType',
    sizeBytes: 'sizeBytes',
    createdAt: 'createdAt'
  };

  export type AudioFileScalarFieldEnum = (typeof AudioFileScalarFieldEnum)[keyof typeof AudioFileScalarFieldEnum]


  export const TranscriptScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    fullText: 'fullText',
    language: 'language',
    source: 'source',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TranscriptScalarFieldEnum = (typeof TranscriptScalarFieldEnum)[keyof typeof TranscriptScalarFieldEnum]


  export const TranscriptSegmentScalarFieldEnum: {
    id: 'id',
    transcriptId: 'transcriptId',
    speaker: 'speaker',
    startTime: 'startTime',
    endTime: 'endTime',
    text: 'text',
    confidence: 'confidence'
  };

  export type TranscriptSegmentScalarFieldEnum = (typeof TranscriptSegmentScalarFieldEnum)[keyof typeof TranscriptSegmentScalarFieldEnum]


  export const MomScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    title: 'title',
    dateTime: 'dateTime',
    participants: 'participants',
    keyPoints: 'keyPoints',
    actionItems: 'actionItems',
    approved: 'approved',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt',
    shared: 'shared',
    lastEditedAt: 'lastEditedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MomScalarFieldEnum = (typeof MomScalarFieldEnum)[keyof typeof MomScalarFieldEnum]


  export const ActionItemScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    description: 'description',
    ownerName: 'ownerName',
    ownerEmail: 'ownerEmail',
    ownerId: 'ownerId',
    dueDate: 'dueDate',
    priority: 'priority',
    status: 'status',
    confidence: 'confidence',
    externalId: 'externalId',
    externalUrl: 'externalUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ActionItemScalarFieldEnum = (typeof ActionItemScalarFieldEnum)[keyof typeof ActionItemScalarFieldEnum]


  export const DecisionScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    text: 'text',
    timestamp: 'timestamp',
    createdAt: 'createdAt'
  };

  export type DecisionScalarFieldEnum = (typeof DecisionScalarFieldEnum)[keyof typeof DecisionScalarFieldEnum]


  export const SummaryScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    shortSummary: 'shortSummary',
    nextAgenda: 'nextAgenda',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SummaryScalarFieldEnum = (typeof SummaryScalarFieldEnum)[keyof typeof SummaryScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    meetingId: 'meetingId',
    userId: 'userId',
    action: 'action',
    details: 'details',
    createdAt: 'createdAt'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'MeetingStatus'
   */
  export type EnumMeetingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeetingStatus'>
    


  /**
   * Reference to a field of type 'MeetingStatus[]'
   */
  export type ListEnumMeetingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeetingStatus[]'>
    


  /**
   * Reference to a field of type 'MeetingTag'
   */
  export type EnumMeetingTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeetingTag'>
    


  /**
   * Reference to a field of type 'MeetingTag[]'
   */
  export type ListEnumMeetingTagFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MeetingTag[]'>
    


  /**
   * Reference to a field of type 'InviteStatus'
   */
  export type EnumInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InviteStatus'>
    


  /**
   * Reference to a field of type 'InviteStatus[]'
   */
  export type ListEnumInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InviteStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TaskPriority'
   */
  export type EnumTaskPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskPriority'>
    


  /**
   * Reference to a field of type 'TaskPriority[]'
   */
  export type ListEnumTaskPriorityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskPriority[]'>
    


  /**
   * Reference to a field of type 'TaskStatus'
   */
  export type EnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus'>
    


  /**
   * Reference to a field of type 'TaskStatus[]'
   */
  export type ListEnumTaskStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TaskStatus[]'>
    


  /**
   * Reference to a field of type 'PipelineStep'
   */
  export type EnumPipelineStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineStep'>
    


  /**
   * Reference to a field of type 'PipelineStep[]'
   */
  export type ListEnumPipelineStepFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PipelineStep[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organizedMeetings?: MeetingListRelationFilter
    ownedTasks?: ActionItemListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizedMeetings?: MeetingOrderByRelationAggregateInput
    ownedTasks?: ActionItemOrderByRelationAggregateInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    organizedMeetings?: MeetingListRelationFilter
    ownedTasks?: ActionItemListRelationFilter
    auditLogs?: AuditLogListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
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
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MeetingWhereInput = {
    AND?: MeetingWhereInput | MeetingWhereInput[]
    OR?: MeetingWhereInput[]
    NOT?: MeetingWhereInput | MeetingWhereInput[]
    id?: StringFilter<"Meeting"> | string
    title?: StringFilter<"Meeting"> | string
    description?: StringFilter<"Meeting"> | string
    scheduledAt?: DateTimeFilter<"Meeting"> | Date | string
    durationMinutes?: IntFilter<"Meeting"> | number
    status?: EnumMeetingStatusFilter<"Meeting"> | $Enums.MeetingStatus
    tag?: EnumMeetingTagFilter<"Meeting"> | $Enums.MeetingTag
    notes?: StringFilter<"Meeting"> | string
    calendarEventId?: StringNullableFilter<"Meeting"> | string | null
    recordingUrl?: StringNullableFilter<"Meeting"> | string | null
    organizerId?: StringNullableFilter<"Meeting"> | string | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
    updatedAt?: DateTimeFilter<"Meeting"> | Date | string
    organizer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    participants?: MeetingParticipantListRelationFilter
    audioFiles?: AudioFileListRelationFilter
    transcript?: XOR<TranscriptNullableScalarRelationFilter, TranscriptWhereInput> | null
    mom?: XOR<MomNullableScalarRelationFilter, MomWhereInput> | null
    actionItems?: ActionItemListRelationFilter
    decisions?: DecisionListRelationFilter
    summary?: XOR<SummaryNullableScalarRelationFilter, SummaryWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
    invites?: MeetingInviteListRelationFilter
  }

  export type MeetingOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    scheduledAt?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    tag?: SortOrder
    notes?: SortOrder
    calendarEventId?: SortOrderInput | SortOrder
    recordingUrl?: SortOrderInput | SortOrder
    organizerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    organizer?: UserOrderByWithRelationInput
    participants?: MeetingParticipantOrderByRelationAggregateInput
    audioFiles?: AudioFileOrderByRelationAggregateInput
    transcript?: TranscriptOrderByWithRelationInput
    mom?: MomOrderByWithRelationInput
    actionItems?: ActionItemOrderByRelationAggregateInput
    decisions?: DecisionOrderByRelationAggregateInput
    summary?: SummaryOrderByWithRelationInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    invites?: MeetingInviteOrderByRelationAggregateInput
  }

  export type MeetingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MeetingWhereInput | MeetingWhereInput[]
    OR?: MeetingWhereInput[]
    NOT?: MeetingWhereInput | MeetingWhereInput[]
    title?: StringFilter<"Meeting"> | string
    description?: StringFilter<"Meeting"> | string
    scheduledAt?: DateTimeFilter<"Meeting"> | Date | string
    durationMinutes?: IntFilter<"Meeting"> | number
    status?: EnumMeetingStatusFilter<"Meeting"> | $Enums.MeetingStatus
    tag?: EnumMeetingTagFilter<"Meeting"> | $Enums.MeetingTag
    notes?: StringFilter<"Meeting"> | string
    calendarEventId?: StringNullableFilter<"Meeting"> | string | null
    recordingUrl?: StringNullableFilter<"Meeting"> | string | null
    organizerId?: StringNullableFilter<"Meeting"> | string | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
    updatedAt?: DateTimeFilter<"Meeting"> | Date | string
    organizer?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    participants?: MeetingParticipantListRelationFilter
    audioFiles?: AudioFileListRelationFilter
    transcript?: XOR<TranscriptNullableScalarRelationFilter, TranscriptWhereInput> | null
    mom?: XOR<MomNullableScalarRelationFilter, MomWhereInput> | null
    actionItems?: ActionItemListRelationFilter
    decisions?: DecisionListRelationFilter
    summary?: XOR<SummaryNullableScalarRelationFilter, SummaryWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
    invites?: MeetingInviteListRelationFilter
  }, "id">

  export type MeetingOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    scheduledAt?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    tag?: SortOrder
    notes?: SortOrder
    calendarEventId?: SortOrderInput | SortOrder
    recordingUrl?: SortOrderInput | SortOrder
    organizerId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MeetingCountOrderByAggregateInput
    _avg?: MeetingAvgOrderByAggregateInput
    _max?: MeetingMaxOrderByAggregateInput
    _min?: MeetingMinOrderByAggregateInput
    _sum?: MeetingSumOrderByAggregateInput
  }

  export type MeetingScalarWhereWithAggregatesInput = {
    AND?: MeetingScalarWhereWithAggregatesInput | MeetingScalarWhereWithAggregatesInput[]
    OR?: MeetingScalarWhereWithAggregatesInput[]
    NOT?: MeetingScalarWhereWithAggregatesInput | MeetingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Meeting"> | string
    title?: StringWithAggregatesFilter<"Meeting"> | string
    description?: StringWithAggregatesFilter<"Meeting"> | string
    scheduledAt?: DateTimeWithAggregatesFilter<"Meeting"> | Date | string
    durationMinutes?: IntWithAggregatesFilter<"Meeting"> | number
    status?: EnumMeetingStatusWithAggregatesFilter<"Meeting"> | $Enums.MeetingStatus
    tag?: EnumMeetingTagWithAggregatesFilter<"Meeting"> | $Enums.MeetingTag
    notes?: StringWithAggregatesFilter<"Meeting"> | string
    calendarEventId?: StringNullableWithAggregatesFilter<"Meeting"> | string | null
    recordingUrl?: StringNullableWithAggregatesFilter<"Meeting"> | string | null
    organizerId?: StringNullableWithAggregatesFilter<"Meeting"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Meeting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Meeting"> | Date | string
  }

  export type MeetingInviteWhereInput = {
    AND?: MeetingInviteWhereInput | MeetingInviteWhereInput[]
    OR?: MeetingInviteWhereInput[]
    NOT?: MeetingInviteWhereInput | MeetingInviteWhereInput[]
    id?: StringFilter<"MeetingInvite"> | string
    meetingId?: StringFilter<"MeetingInvite"> | string
    email?: StringFilter<"MeetingInvite"> | string
    name?: StringFilter<"MeetingInvite"> | string
    status?: EnumInviteStatusFilter<"MeetingInvite"> | $Enums.InviteStatus
    error?: StringNullableFilter<"MeetingInvite"> | string | null
    sentAt?: DateTimeFilter<"MeetingInvite"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type MeetingInviteOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type MeetingInviteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MeetingInviteWhereInput | MeetingInviteWhereInput[]
    OR?: MeetingInviteWhereInput[]
    NOT?: MeetingInviteWhereInput | MeetingInviteWhereInput[]
    meetingId?: StringFilter<"MeetingInvite"> | string
    email?: StringFilter<"MeetingInvite"> | string
    name?: StringFilter<"MeetingInvite"> | string
    status?: EnumInviteStatusFilter<"MeetingInvite"> | $Enums.InviteStatus
    error?: StringNullableFilter<"MeetingInvite"> | string | null
    sentAt?: DateTimeFilter<"MeetingInvite"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id">

  export type MeetingInviteOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    status?: SortOrder
    error?: SortOrderInput | SortOrder
    sentAt?: SortOrder
    _count?: MeetingInviteCountOrderByAggregateInput
    _max?: MeetingInviteMaxOrderByAggregateInput
    _min?: MeetingInviteMinOrderByAggregateInput
  }

  export type MeetingInviteScalarWhereWithAggregatesInput = {
    AND?: MeetingInviteScalarWhereWithAggregatesInput | MeetingInviteScalarWhereWithAggregatesInput[]
    OR?: MeetingInviteScalarWhereWithAggregatesInput[]
    NOT?: MeetingInviteScalarWhereWithAggregatesInput | MeetingInviteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeetingInvite"> | string
    meetingId?: StringWithAggregatesFilter<"MeetingInvite"> | string
    email?: StringWithAggregatesFilter<"MeetingInvite"> | string
    name?: StringWithAggregatesFilter<"MeetingInvite"> | string
    status?: EnumInviteStatusWithAggregatesFilter<"MeetingInvite"> | $Enums.InviteStatus
    error?: StringNullableWithAggregatesFilter<"MeetingInvite"> | string | null
    sentAt?: DateTimeWithAggregatesFilter<"MeetingInvite"> | Date | string
  }

  export type MeetingParticipantWhereInput = {
    AND?: MeetingParticipantWhereInput | MeetingParticipantWhereInput[]
    OR?: MeetingParticipantWhereInput[]
    NOT?: MeetingParticipantWhereInput | MeetingParticipantWhereInput[]
    id?: StringFilter<"MeetingParticipant"> | string
    meetingId?: StringFilter<"MeetingParticipant"> | string
    name?: StringFilter<"MeetingParticipant"> | string
    email?: StringFilter<"MeetingParticipant"> | string
    role?: StringNullableFilter<"MeetingParticipant"> | string | null
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type MeetingParticipantOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrderInput | SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type MeetingParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MeetingParticipantWhereInput | MeetingParticipantWhereInput[]
    OR?: MeetingParticipantWhereInput[]
    NOT?: MeetingParticipantWhereInput | MeetingParticipantWhereInput[]
    meetingId?: StringFilter<"MeetingParticipant"> | string
    name?: StringFilter<"MeetingParticipant"> | string
    email?: StringFilter<"MeetingParticipant"> | string
    role?: StringNullableFilter<"MeetingParticipant"> | string | null
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id">

  export type MeetingParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrderInput | SortOrder
    _count?: MeetingParticipantCountOrderByAggregateInput
    _max?: MeetingParticipantMaxOrderByAggregateInput
    _min?: MeetingParticipantMinOrderByAggregateInput
  }

  export type MeetingParticipantScalarWhereWithAggregatesInput = {
    AND?: MeetingParticipantScalarWhereWithAggregatesInput | MeetingParticipantScalarWhereWithAggregatesInput[]
    OR?: MeetingParticipantScalarWhereWithAggregatesInput[]
    NOT?: MeetingParticipantScalarWhereWithAggregatesInput | MeetingParticipantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeetingParticipant"> | string
    meetingId?: StringWithAggregatesFilter<"MeetingParticipant"> | string
    name?: StringWithAggregatesFilter<"MeetingParticipant"> | string
    email?: StringWithAggregatesFilter<"MeetingParticipant"> | string
    role?: StringNullableWithAggregatesFilter<"MeetingParticipant"> | string | null
  }

  export type AudioFileWhereInput = {
    AND?: AudioFileWhereInput | AudioFileWhereInput[]
    OR?: AudioFileWhereInput[]
    NOT?: AudioFileWhereInput | AudioFileWhereInput[]
    id?: StringFilter<"AudioFile"> | string
    meetingId?: StringFilter<"AudioFile"> | string
    storageKey?: StringFilter<"AudioFile"> | string
    mimeType?: StringFilter<"AudioFile"> | string
    sizeBytes?: IntFilter<"AudioFile"> | number
    createdAt?: DateTimeFilter<"AudioFile"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type AudioFileOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type AudioFileWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AudioFileWhereInput | AudioFileWhereInput[]
    OR?: AudioFileWhereInput[]
    NOT?: AudioFileWhereInput | AudioFileWhereInput[]
    meetingId?: StringFilter<"AudioFile"> | string
    storageKey?: StringFilter<"AudioFile"> | string
    mimeType?: StringFilter<"AudioFile"> | string
    sizeBytes?: IntFilter<"AudioFile"> | number
    createdAt?: DateTimeFilter<"AudioFile"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id">

  export type AudioFileOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
    _count?: AudioFileCountOrderByAggregateInput
    _avg?: AudioFileAvgOrderByAggregateInput
    _max?: AudioFileMaxOrderByAggregateInput
    _min?: AudioFileMinOrderByAggregateInput
    _sum?: AudioFileSumOrderByAggregateInput
  }

  export type AudioFileScalarWhereWithAggregatesInput = {
    AND?: AudioFileScalarWhereWithAggregatesInput | AudioFileScalarWhereWithAggregatesInput[]
    OR?: AudioFileScalarWhereWithAggregatesInput[]
    NOT?: AudioFileScalarWhereWithAggregatesInput | AudioFileScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AudioFile"> | string
    meetingId?: StringWithAggregatesFilter<"AudioFile"> | string
    storageKey?: StringWithAggregatesFilter<"AudioFile"> | string
    mimeType?: StringWithAggregatesFilter<"AudioFile"> | string
    sizeBytes?: IntWithAggregatesFilter<"AudioFile"> | number
    createdAt?: DateTimeWithAggregatesFilter<"AudioFile"> | Date | string
  }

  export type TranscriptWhereInput = {
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    id?: StringFilter<"Transcript"> | string
    meetingId?: StringFilter<"Transcript"> | string
    fullText?: StringFilter<"Transcript"> | string
    language?: StringFilter<"Transcript"> | string
    source?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    segments?: TranscriptSegmentListRelationFilter
  }

  export type TranscriptOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullText?: SortOrder
    language?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    segments?: TranscriptSegmentOrderByRelationAggregateInput
  }

  export type TranscriptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    meetingId?: string
    AND?: TranscriptWhereInput | TranscriptWhereInput[]
    OR?: TranscriptWhereInput[]
    NOT?: TranscriptWhereInput | TranscriptWhereInput[]
    fullText?: StringFilter<"Transcript"> | string
    language?: StringFilter<"Transcript"> | string
    source?: StringFilter<"Transcript"> | string
    createdAt?: DateTimeFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeFilter<"Transcript"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    segments?: TranscriptSegmentListRelationFilter
  }, "id" | "meetingId">

  export type TranscriptOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullText?: SortOrder
    language?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TranscriptCountOrderByAggregateInput
    _max?: TranscriptMaxOrderByAggregateInput
    _min?: TranscriptMinOrderByAggregateInput
  }

  export type TranscriptScalarWhereWithAggregatesInput = {
    AND?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    OR?: TranscriptScalarWhereWithAggregatesInput[]
    NOT?: TranscriptScalarWhereWithAggregatesInput | TranscriptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Transcript"> | string
    meetingId?: StringWithAggregatesFilter<"Transcript"> | string
    fullText?: StringWithAggregatesFilter<"Transcript"> | string
    language?: StringWithAggregatesFilter<"Transcript"> | string
    source?: StringWithAggregatesFilter<"Transcript"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transcript"> | Date | string
  }

  export type TranscriptSegmentWhereInput = {
    AND?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    OR?: TranscriptSegmentWhereInput[]
    NOT?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    id?: StringFilter<"TranscriptSegment"> | string
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    speaker?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatNullableFilter<"TranscriptSegment"> | number | null
    transcript?: XOR<TranscriptScalarRelationFilter, TranscriptWhereInput>
  }

  export type TranscriptSegmentOrderByWithRelationInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    speaker?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    text?: SortOrder
    confidence?: SortOrderInput | SortOrder
    transcript?: TranscriptOrderByWithRelationInput
  }

  export type TranscriptSegmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    OR?: TranscriptSegmentWhereInput[]
    NOT?: TranscriptSegmentWhereInput | TranscriptSegmentWhereInput[]
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    speaker?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatNullableFilter<"TranscriptSegment"> | number | null
    transcript?: XOR<TranscriptScalarRelationFilter, TranscriptWhereInput>
  }, "id">

  export type TranscriptSegmentOrderByWithAggregationInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    speaker?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    text?: SortOrder
    confidence?: SortOrderInput | SortOrder
    _count?: TranscriptSegmentCountOrderByAggregateInput
    _avg?: TranscriptSegmentAvgOrderByAggregateInput
    _max?: TranscriptSegmentMaxOrderByAggregateInput
    _min?: TranscriptSegmentMinOrderByAggregateInput
    _sum?: TranscriptSegmentSumOrderByAggregateInput
  }

  export type TranscriptSegmentScalarWhereWithAggregatesInput = {
    AND?: TranscriptSegmentScalarWhereWithAggregatesInput | TranscriptSegmentScalarWhereWithAggregatesInput[]
    OR?: TranscriptSegmentScalarWhereWithAggregatesInput[]
    NOT?: TranscriptSegmentScalarWhereWithAggregatesInput | TranscriptSegmentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    transcriptId?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    speaker?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    startTime?: FloatWithAggregatesFilter<"TranscriptSegment"> | number
    endTime?: FloatWithAggregatesFilter<"TranscriptSegment"> | number
    text?: StringWithAggregatesFilter<"TranscriptSegment"> | string
    confidence?: FloatNullableWithAggregatesFilter<"TranscriptSegment"> | number | null
  }

  export type MomWhereInput = {
    AND?: MomWhereInput | MomWhereInput[]
    OR?: MomWhereInput[]
    NOT?: MomWhereInput | MomWhereInput[]
    id?: StringFilter<"Mom"> | string
    meetingId?: StringFilter<"Mom"> | string
    title?: StringFilter<"Mom"> | string
    dateTime?: StringFilter<"Mom"> | string
    participants?: JsonFilter<"Mom">
    keyPoints?: JsonFilter<"Mom">
    actionItems?: JsonFilter<"Mom">
    approved?: BoolFilter<"Mom"> | boolean
    approvedBy?: StringNullableFilter<"Mom"> | string | null
    approvedAt?: DateTimeNullableFilter<"Mom"> | Date | string | null
    shared?: BoolFilter<"Mom"> | boolean
    lastEditedAt?: DateTimeNullableFilter<"Mom"> | Date | string | null
    createdAt?: DateTimeFilter<"Mom"> | Date | string
    updatedAt?: DateTimeFilter<"Mom"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type MomOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    title?: SortOrder
    dateTime?: SortOrder
    participants?: SortOrder
    keyPoints?: SortOrder
    actionItems?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    shared?: SortOrder
    lastEditedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type MomWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    meetingId?: string
    AND?: MomWhereInput | MomWhereInput[]
    OR?: MomWhereInput[]
    NOT?: MomWhereInput | MomWhereInput[]
    title?: StringFilter<"Mom"> | string
    dateTime?: StringFilter<"Mom"> | string
    participants?: JsonFilter<"Mom">
    keyPoints?: JsonFilter<"Mom">
    actionItems?: JsonFilter<"Mom">
    approved?: BoolFilter<"Mom"> | boolean
    approvedBy?: StringNullableFilter<"Mom"> | string | null
    approvedAt?: DateTimeNullableFilter<"Mom"> | Date | string | null
    shared?: BoolFilter<"Mom"> | boolean
    lastEditedAt?: DateTimeNullableFilter<"Mom"> | Date | string | null
    createdAt?: DateTimeFilter<"Mom"> | Date | string
    updatedAt?: DateTimeFilter<"Mom"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id" | "meetingId">

  export type MomOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    title?: SortOrder
    dateTime?: SortOrder
    participants?: SortOrder
    keyPoints?: SortOrder
    actionItems?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    shared?: SortOrder
    lastEditedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MomCountOrderByAggregateInput
    _max?: MomMaxOrderByAggregateInput
    _min?: MomMinOrderByAggregateInput
  }

  export type MomScalarWhereWithAggregatesInput = {
    AND?: MomScalarWhereWithAggregatesInput | MomScalarWhereWithAggregatesInput[]
    OR?: MomScalarWhereWithAggregatesInput[]
    NOT?: MomScalarWhereWithAggregatesInput | MomScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Mom"> | string
    meetingId?: StringWithAggregatesFilter<"Mom"> | string
    title?: StringWithAggregatesFilter<"Mom"> | string
    dateTime?: StringWithAggregatesFilter<"Mom"> | string
    participants?: JsonWithAggregatesFilter<"Mom">
    keyPoints?: JsonWithAggregatesFilter<"Mom">
    actionItems?: JsonWithAggregatesFilter<"Mom">
    approved?: BoolWithAggregatesFilter<"Mom"> | boolean
    approvedBy?: StringNullableWithAggregatesFilter<"Mom"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Mom"> | Date | string | null
    shared?: BoolWithAggregatesFilter<"Mom"> | boolean
    lastEditedAt?: DateTimeNullableWithAggregatesFilter<"Mom"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Mom"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Mom"> | Date | string
  }

  export type ActionItemWhereInput = {
    AND?: ActionItemWhereInput | ActionItemWhereInput[]
    OR?: ActionItemWhereInput[]
    NOT?: ActionItemWhereInput | ActionItemWhereInput[]
    id?: StringFilter<"ActionItem"> | string
    meetingId?: StringFilter<"ActionItem"> | string
    description?: StringFilter<"ActionItem"> | string
    ownerName?: StringNullableFilter<"ActionItem"> | string | null
    ownerEmail?: StringNullableFilter<"ActionItem"> | string | null
    ownerId?: StringNullableFilter<"ActionItem"> | string | null
    dueDate?: DateTimeNullableFilter<"ActionItem"> | Date | string | null
    priority?: EnumTaskPriorityFilter<"ActionItem"> | $Enums.TaskPriority
    status?: EnumTaskStatusFilter<"ActionItem"> | $Enums.TaskStatus
    confidence?: FloatNullableFilter<"ActionItem"> | number | null
    externalId?: StringNullableFilter<"ActionItem"> | string | null
    externalUrl?: StringNullableFilter<"ActionItem"> | string | null
    createdAt?: DateTimeFilter<"ActionItem"> | Date | string
    updatedAt?: DateTimeFilter<"ActionItem"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type ActionItemOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    description?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerEmail?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    priority?: SortOrder
    status?: SortOrder
    confidence?: SortOrderInput | SortOrder
    externalId?: SortOrderInput | SortOrder
    externalUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    owner?: UserOrderByWithRelationInput
  }

  export type ActionItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ActionItemWhereInput | ActionItemWhereInput[]
    OR?: ActionItemWhereInput[]
    NOT?: ActionItemWhereInput | ActionItemWhereInput[]
    meetingId?: StringFilter<"ActionItem"> | string
    description?: StringFilter<"ActionItem"> | string
    ownerName?: StringNullableFilter<"ActionItem"> | string | null
    ownerEmail?: StringNullableFilter<"ActionItem"> | string | null
    ownerId?: StringNullableFilter<"ActionItem"> | string | null
    dueDate?: DateTimeNullableFilter<"ActionItem"> | Date | string | null
    priority?: EnumTaskPriorityFilter<"ActionItem"> | $Enums.TaskPriority
    status?: EnumTaskStatusFilter<"ActionItem"> | $Enums.TaskStatus
    confidence?: FloatNullableFilter<"ActionItem"> | number | null
    externalId?: StringNullableFilter<"ActionItem"> | string | null
    externalUrl?: StringNullableFilter<"ActionItem"> | string | null
    createdAt?: DateTimeFilter<"ActionItem"> | Date | string
    updatedAt?: DateTimeFilter<"ActionItem"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
    owner?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type ActionItemOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    description?: SortOrder
    ownerName?: SortOrderInput | SortOrder
    ownerEmail?: SortOrderInput | SortOrder
    ownerId?: SortOrderInput | SortOrder
    dueDate?: SortOrderInput | SortOrder
    priority?: SortOrder
    status?: SortOrder
    confidence?: SortOrderInput | SortOrder
    externalId?: SortOrderInput | SortOrder
    externalUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ActionItemCountOrderByAggregateInput
    _avg?: ActionItemAvgOrderByAggregateInput
    _max?: ActionItemMaxOrderByAggregateInput
    _min?: ActionItemMinOrderByAggregateInput
    _sum?: ActionItemSumOrderByAggregateInput
  }

  export type ActionItemScalarWhereWithAggregatesInput = {
    AND?: ActionItemScalarWhereWithAggregatesInput | ActionItemScalarWhereWithAggregatesInput[]
    OR?: ActionItemScalarWhereWithAggregatesInput[]
    NOT?: ActionItemScalarWhereWithAggregatesInput | ActionItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ActionItem"> | string
    meetingId?: StringWithAggregatesFilter<"ActionItem"> | string
    description?: StringWithAggregatesFilter<"ActionItem"> | string
    ownerName?: StringNullableWithAggregatesFilter<"ActionItem"> | string | null
    ownerEmail?: StringNullableWithAggregatesFilter<"ActionItem"> | string | null
    ownerId?: StringNullableWithAggregatesFilter<"ActionItem"> | string | null
    dueDate?: DateTimeNullableWithAggregatesFilter<"ActionItem"> | Date | string | null
    priority?: EnumTaskPriorityWithAggregatesFilter<"ActionItem"> | $Enums.TaskPriority
    status?: EnumTaskStatusWithAggregatesFilter<"ActionItem"> | $Enums.TaskStatus
    confidence?: FloatNullableWithAggregatesFilter<"ActionItem"> | number | null
    externalId?: StringNullableWithAggregatesFilter<"ActionItem"> | string | null
    externalUrl?: StringNullableWithAggregatesFilter<"ActionItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ActionItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ActionItem"> | Date | string
  }

  export type DecisionWhereInput = {
    AND?: DecisionWhereInput | DecisionWhereInput[]
    OR?: DecisionWhereInput[]
    NOT?: DecisionWhereInput | DecisionWhereInput[]
    id?: StringFilter<"Decision"> | string
    meetingId?: StringFilter<"Decision"> | string
    text?: StringFilter<"Decision"> | string
    timestamp?: FloatNullableFilter<"Decision"> | number | null
    createdAt?: DateTimeFilter<"Decision"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type DecisionOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    text?: SortOrder
    timestamp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type DecisionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DecisionWhereInput | DecisionWhereInput[]
    OR?: DecisionWhereInput[]
    NOT?: DecisionWhereInput | DecisionWhereInput[]
    meetingId?: StringFilter<"Decision"> | string
    text?: StringFilter<"Decision"> | string
    timestamp?: FloatNullableFilter<"Decision"> | number | null
    createdAt?: DateTimeFilter<"Decision"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id">

  export type DecisionOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    text?: SortOrder
    timestamp?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: DecisionCountOrderByAggregateInput
    _avg?: DecisionAvgOrderByAggregateInput
    _max?: DecisionMaxOrderByAggregateInput
    _min?: DecisionMinOrderByAggregateInput
    _sum?: DecisionSumOrderByAggregateInput
  }

  export type DecisionScalarWhereWithAggregatesInput = {
    AND?: DecisionScalarWhereWithAggregatesInput | DecisionScalarWhereWithAggregatesInput[]
    OR?: DecisionScalarWhereWithAggregatesInput[]
    NOT?: DecisionScalarWhereWithAggregatesInput | DecisionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Decision"> | string
    meetingId?: StringWithAggregatesFilter<"Decision"> | string
    text?: StringWithAggregatesFilter<"Decision"> | string
    timestamp?: FloatNullableWithAggregatesFilter<"Decision"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Decision"> | Date | string
  }

  export type SummaryWhereInput = {
    AND?: SummaryWhereInput | SummaryWhereInput[]
    OR?: SummaryWhereInput[]
    NOT?: SummaryWhereInput | SummaryWhereInput[]
    id?: StringFilter<"Summary"> | string
    meetingId?: StringFilter<"Summary"> | string
    shortSummary?: StringFilter<"Summary"> | string
    nextAgenda?: JsonNullableFilter<"Summary">
    createdAt?: DateTimeFilter<"Summary"> | Date | string
    updatedAt?: DateTimeFilter<"Summary"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }

  export type SummaryOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    shortSummary?: SortOrder
    nextAgenda?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
  }

  export type SummaryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    meetingId?: string
    AND?: SummaryWhereInput | SummaryWhereInput[]
    OR?: SummaryWhereInput[]
    NOT?: SummaryWhereInput | SummaryWhereInput[]
    shortSummary?: StringFilter<"Summary"> | string
    nextAgenda?: JsonNullableFilter<"Summary">
    createdAt?: DateTimeFilter<"Summary"> | Date | string
    updatedAt?: DateTimeFilter<"Summary"> | Date | string
    meeting?: XOR<MeetingScalarRelationFilter, MeetingWhereInput>
  }, "id" | "meetingId">

  export type SummaryOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrder
    shortSummary?: SortOrder
    nextAgenda?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SummaryCountOrderByAggregateInput
    _max?: SummaryMaxOrderByAggregateInput
    _min?: SummaryMinOrderByAggregateInput
  }

  export type SummaryScalarWhereWithAggregatesInput = {
    AND?: SummaryScalarWhereWithAggregatesInput | SummaryScalarWhereWithAggregatesInput[]
    OR?: SummaryScalarWhereWithAggregatesInput[]
    NOT?: SummaryScalarWhereWithAggregatesInput | SummaryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Summary"> | string
    meetingId?: StringWithAggregatesFilter<"Summary"> | string
    shortSummary?: StringWithAggregatesFilter<"Summary"> | string
    nextAgenda?: JsonNullableWithAggregatesFilter<"Summary">
    createdAt?: DateTimeWithAggregatesFilter<"Summary"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Summary"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    meetingId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: EnumPipelineStepFilter<"AuditLog"> | $Enums.PipelineStep
    details?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    meeting?: XOR<MeetingNullableScalarRelationFilter, MeetingWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    meetingId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    meeting?: MeetingOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    meetingId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: EnumPipelineStepFilter<"AuditLog"> | $Enums.PipelineStep
    details?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    meeting?: XOR<MeetingNullableScalarRelationFilter, MeetingWhereInput> | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    meetingId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    details?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    meetingId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    action?: EnumPipelineStepWithAggregatesFilter<"AuditLog"> | $Enums.PipelineStep
    details?: JsonNullableWithAggregatesFilter<"AuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingCreateNestedManyWithoutOrganizerInput
    ownedTasks?: ActionItemCreateNestedManyWithoutOwnerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingUncheckedCreateNestedManyWithoutOrganizerInput
    ownedTasks?: ActionItemUncheckedCreateNestedManyWithoutOwnerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUpdateManyWithoutOrganizerNestedInput
    ownedTasks?: ActionItemUpdateManyWithoutOwnerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUncheckedUpdateManyWithoutOrganizerNestedInput
    ownedTasks?: ActionItemUncheckedUpdateManyWithoutOwnerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingCreateInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateManyInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MeetingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteCreateInput = {
    id?: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutInvitesInput
  }

  export type MeetingInviteUncheckedCreateInput = {
    id?: string
    meetingId: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
  }

  export type MeetingInviteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutInvitesNestedInput
  }

  export type MeetingInviteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteCreateManyInput = {
    id?: string
    meetingId: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
  }

  export type MeetingInviteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingParticipantCreateInput = {
    id?: string
    name: string
    email: string
    role?: string | null
    meeting: MeetingCreateNestedOneWithoutParticipantsInput
  }

  export type MeetingParticipantUncheckedCreateInput = {
    id?: string
    meetingId: string
    name: string
    email: string
    role?: string | null
  }

  export type MeetingParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
    meeting?: MeetingUpdateOneRequiredWithoutParticipantsNestedInput
  }

  export type MeetingParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MeetingParticipantCreateManyInput = {
    id?: string
    meetingId: string
    name: string
    email: string
    role?: string | null
  }

  export type MeetingParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MeetingParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AudioFileCreateInput = {
    id?: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutAudioFilesInput
  }

  export type AudioFileUncheckedCreateInput = {
    id?: string
    meetingId: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
  }

  export type AudioFileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutAudioFilesNestedInput
  }

  export type AudioFileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudioFileCreateManyInput = {
    id?: string
    meetingId: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
  }

  export type AudioFileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudioFileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptCreateInput = {
    id?: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutTranscriptInput
    segments?: TranscriptSegmentCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateInput = {
    id?: string
    meetingId: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutTranscriptNestedInput
    segments?: TranscriptSegmentUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptCreateManyInput = {
    id?: string
    meetingId: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptSegmentCreateInput = {
    id?: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
    transcript: TranscriptCreateNestedOneWithoutSegmentsInput
  }

  export type TranscriptSegmentUncheckedCreateInput = {
    id?: string
    transcriptId: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
  }

  export type TranscriptSegmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    transcript?: TranscriptUpdateOneRequiredWithoutSegmentsNestedInput
  }

  export type TranscriptSegmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptSegmentCreateManyInput = {
    id?: string
    transcriptId: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
  }

  export type TranscriptSegmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptSegmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    transcriptId?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type MomCreateInput = {
    id?: string
    title: string
    dateTime: string
    participants: JsonNullValueInput | InputJsonValue
    keyPoints: JsonNullValueInput | InputJsonValue
    actionItems: JsonNullValueInput | InputJsonValue
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    shared?: boolean
    lastEditedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutMomInput
  }

  export type MomUncheckedCreateInput = {
    id?: string
    meetingId: string
    title: string
    dateTime: string
    participants: JsonNullValueInput | InputJsonValue
    keyPoints: JsonNullValueInput | InputJsonValue
    actionItems: JsonNullValueInput | InputJsonValue
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    shared?: boolean
    lastEditedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MomUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutMomNestedInput
  }

  export type MomUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MomCreateManyInput = {
    id?: string
    meetingId: string
    title: string
    dateTime: string
    participants: JsonNullValueInput | InputJsonValue
    keyPoints: JsonNullValueInput | InputJsonValue
    actionItems: JsonNullValueInput | InputJsonValue
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    shared?: boolean
    lastEditedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MomUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MomUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemCreateInput = {
    id?: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutActionItemsInput
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
  }

  export type ActionItemUncheckedCreateInput = {
    id?: string
    meetingId: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    ownerId?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutActionItemsNestedInput
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
  }

  export type ActionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemCreateManyInput = {
    id?: string
    meetingId: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    ownerId?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionCreateInput = {
    id?: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutDecisionsInput
  }

  export type DecisionUncheckedCreateInput = {
    id?: string
    meetingId: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
  }

  export type DecisionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutDecisionsNestedInput
  }

  export type DecisionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionCreateManyInput = {
    id?: string
    meetingId: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
  }

  export type DecisionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SummaryCreateInput = {
    id?: string
    shortSummary: string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutSummaryInput
  }

  export type SummaryUncheckedCreateInput = {
    id?: string
    meetingId: string
    shortSummary: string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SummaryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutSummaryNestedInput
  }

  export type SummaryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SummaryCreateManyInput = {
    id?: string
    meetingId: string
    shortSummary: string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SummaryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SummaryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    meeting?: MeetingCreateNestedOneWithoutAuditLogsInput
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    meetingId?: string | null
    userId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneWithoutAuditLogsNestedInput
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateManyInput = {
    id?: string
    meetingId?: string | null
    userId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
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

  export type MeetingListRelationFilter = {
    every?: MeetingWhereInput
    some?: MeetingWhereInput
    none?: MeetingWhereInput
  }

  export type ActionItemListRelationFilter = {
    every?: ActionItemWhereInput
    some?: ActionItemWhereInput
    none?: ActionItemWhereInput
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type MeetingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ActionItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
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

  export type EnumMeetingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingStatus | EnumMeetingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingStatusFilter<$PrismaModel> | $Enums.MeetingStatus
  }

  export type EnumMeetingTagFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingTag | EnumMeetingTagFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingTagFilter<$PrismaModel> | $Enums.MeetingTag
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

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type MeetingParticipantListRelationFilter = {
    every?: MeetingParticipantWhereInput
    some?: MeetingParticipantWhereInput
    none?: MeetingParticipantWhereInput
  }

  export type AudioFileListRelationFilter = {
    every?: AudioFileWhereInput
    some?: AudioFileWhereInput
    none?: AudioFileWhereInput
  }

  export type TranscriptNullableScalarRelationFilter = {
    is?: TranscriptWhereInput | null
    isNot?: TranscriptWhereInput | null
  }

  export type MomNullableScalarRelationFilter = {
    is?: MomWhereInput | null
    isNot?: MomWhereInput | null
  }

  export type DecisionListRelationFilter = {
    every?: DecisionWhereInput
    some?: DecisionWhereInput
    none?: DecisionWhereInput
  }

  export type SummaryNullableScalarRelationFilter = {
    is?: SummaryWhereInput | null
    isNot?: SummaryWhereInput | null
  }

  export type MeetingInviteListRelationFilter = {
    every?: MeetingInviteWhereInput
    some?: MeetingInviteWhereInput
    none?: MeetingInviteWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MeetingParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AudioFileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DecisionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MeetingInviteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MeetingCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    scheduledAt?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    tag?: SortOrder
    notes?: SortOrder
    calendarEventId?: SortOrder
    recordingUrl?: SortOrder
    organizerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingAvgOrderByAggregateInput = {
    durationMinutes?: SortOrder
  }

  export type MeetingMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    scheduledAt?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    tag?: SortOrder
    notes?: SortOrder
    calendarEventId?: SortOrder
    recordingUrl?: SortOrder
    organizerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    scheduledAt?: SortOrder
    durationMinutes?: SortOrder
    status?: SortOrder
    tag?: SortOrder
    notes?: SortOrder
    calendarEventId?: SortOrder
    recordingUrl?: SortOrder
    organizerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeetingSumOrderByAggregateInput = {
    durationMinutes?: SortOrder
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

  export type EnumMeetingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingStatus | EnumMeetingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingStatusWithAggregatesFilter<$PrismaModel> | $Enums.MeetingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMeetingStatusFilter<$PrismaModel>
    _max?: NestedEnumMeetingStatusFilter<$PrismaModel>
  }

  export type EnumMeetingTagWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingTag | EnumMeetingTagFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingTagWithAggregatesFilter<$PrismaModel> | $Enums.MeetingTag
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMeetingTagFilter<$PrismaModel>
    _max?: NestedEnumMeetingTagFilter<$PrismaModel>
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

  export type EnumInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | EnumInviteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInviteStatusFilter<$PrismaModel> | $Enums.InviteStatus
  }

  export type MeetingScalarRelationFilter = {
    is?: MeetingWhereInput
    isNot?: MeetingWhereInput
  }

  export type MeetingInviteCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sentAt?: SortOrder
  }

  export type MeetingInviteMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sentAt?: SortOrder
  }

  export type MeetingInviteMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    email?: SortOrder
    name?: SortOrder
    status?: SortOrder
    error?: SortOrder
    sentAt?: SortOrder
  }

  export type EnumInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | EnumInviteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.InviteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInviteStatusFilter<$PrismaModel>
    _max?: NestedEnumInviteStatusFilter<$PrismaModel>
  }

  export type MeetingParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
  }

  export type MeetingParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
  }

  export type MeetingParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    name?: SortOrder
    email?: SortOrder
    role?: SortOrder
  }

  export type AudioFileCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type AudioFileAvgOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type AudioFileMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type AudioFileMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    storageKey?: SortOrder
    mimeType?: SortOrder
    sizeBytes?: SortOrder
    createdAt?: SortOrder
  }

  export type AudioFileSumOrderByAggregateInput = {
    sizeBytes?: SortOrder
  }

  export type TranscriptSegmentListRelationFilter = {
    every?: TranscriptSegmentWhereInput
    some?: TranscriptSegmentWhereInput
    none?: TranscriptSegmentWhereInput
  }

  export type TranscriptSegmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TranscriptCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullText?: SortOrder
    language?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullText?: SortOrder
    language?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TranscriptMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    fullText?: SortOrder
    language?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type TranscriptScalarRelationFilter = {
    is?: TranscriptWhereInput
    isNot?: TranscriptWhereInput
  }

  export type TranscriptSegmentCountOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    speaker?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentAvgOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentMaxOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    speaker?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentMinOrderByAggregateInput = {
    id?: SortOrder
    transcriptId?: SortOrder
    speaker?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    text?: SortOrder
    confidence?: SortOrder
  }

  export type TranscriptSegmentSumOrderByAggregateInput = {
    startTime?: SortOrder
    endTime?: SortOrder
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type MomCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    title?: SortOrder
    dateTime?: SortOrder
    participants?: SortOrder
    keyPoints?: SortOrder
    actionItems?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    shared?: SortOrder
    lastEditedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MomMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    title?: SortOrder
    dateTime?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    shared?: SortOrder
    lastEditedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MomMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    title?: SortOrder
    dateTime?: SortOrder
    approved?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    shared?: SortOrder
    lastEditedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumTaskPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | EnumTaskPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskPriorityFilter<$PrismaModel> | $Enums.TaskPriority
  }

  export type EnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type ActionItemCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    description?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerId?: SortOrder
    dueDate?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    confidence?: SortOrder
    externalId?: SortOrder
    externalUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionItemAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type ActionItemMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    description?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerId?: SortOrder
    dueDate?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    confidence?: SortOrder
    externalId?: SortOrder
    externalUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionItemMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    description?: SortOrder
    ownerName?: SortOrder
    ownerEmail?: SortOrder
    ownerId?: SortOrder
    dueDate?: SortOrder
    priority?: SortOrder
    status?: SortOrder
    confidence?: SortOrder
    externalId?: SortOrder
    externalUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ActionItemSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type EnumTaskPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | EnumTaskPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel> | $Enums.TaskPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskPriorityFilter<$PrismaModel>
    _max?: NestedEnumTaskPriorityFilter<$PrismaModel>
  }

  export type EnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }

  export type DecisionCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type DecisionAvgOrderByAggregateInput = {
    timestamp?: SortOrder
  }

  export type DecisionMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type DecisionMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    createdAt?: SortOrder
  }

  export type DecisionSumOrderByAggregateInput = {
    timestamp?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type SummaryCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    shortSummary?: SortOrder
    nextAgenda?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SummaryMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    shortSummary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SummaryMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    shortSummary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumPipelineStepFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStep | EnumPipelineStepFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStepFilter<$PrismaModel> | $Enums.PipelineStep
  }

  export type MeetingNullableScalarRelationFilter = {
    is?: MeetingWhereInput | null
    isNot?: MeetingWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    details?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    meetingId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumPipelineStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStep | EnumPipelineStepFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStepWithAggregatesFilter<$PrismaModel> | $Enums.PipelineStep
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStepFilter<$PrismaModel>
    _max?: NestedEnumPipelineStepFilter<$PrismaModel>
  }

  export type MeetingCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput> | MeetingCreateWithoutOrganizerInput[] | MeetingUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutOrganizerInput | MeetingCreateOrConnectWithoutOrganizerInput[]
    createMany?: MeetingCreateManyOrganizerInputEnvelope
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
  }

  export type ActionItemCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput> | ActionItemCreateWithoutOwnerInput[] | ActionItemUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutOwnerInput | ActionItemCreateOrConnectWithoutOwnerInput[]
    createMany?: ActionItemCreateManyOwnerInputEnvelope
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type MeetingUncheckedCreateNestedManyWithoutOrganizerInput = {
    create?: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput> | MeetingCreateWithoutOrganizerInput[] | MeetingUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutOrganizerInput | MeetingCreateOrConnectWithoutOrganizerInput[]
    createMany?: MeetingCreateManyOrganizerInputEnvelope
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
  }

  export type ActionItemUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput> | ActionItemCreateWithoutOwnerInput[] | ActionItemUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutOwnerInput | ActionItemCreateOrConnectWithoutOwnerInput[]
    createMany?: ActionItemCreateManyOwnerInputEnvelope
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type MeetingUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput> | MeetingCreateWithoutOrganizerInput[] | MeetingUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutOrganizerInput | MeetingCreateOrConnectWithoutOrganizerInput[]
    upsert?: MeetingUpsertWithWhereUniqueWithoutOrganizerInput | MeetingUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: MeetingCreateManyOrganizerInputEnvelope
    set?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    disconnect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    delete?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    update?: MeetingUpdateWithWhereUniqueWithoutOrganizerInput | MeetingUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: MeetingUpdateManyWithWhereWithoutOrganizerInput | MeetingUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
  }

  export type ActionItemUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput> | ActionItemCreateWithoutOwnerInput[] | ActionItemUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutOwnerInput | ActionItemCreateOrConnectWithoutOwnerInput[]
    upsert?: ActionItemUpsertWithWhereUniqueWithoutOwnerInput | ActionItemUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ActionItemCreateManyOwnerInputEnvelope
    set?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    disconnect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    delete?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    update?: ActionItemUpdateWithWhereUniqueWithoutOwnerInput | ActionItemUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ActionItemUpdateManyWithWhereWithoutOwnerInput | ActionItemUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type MeetingUncheckedUpdateManyWithoutOrganizerNestedInput = {
    create?: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput> | MeetingCreateWithoutOrganizerInput[] | MeetingUncheckedCreateWithoutOrganizerInput[]
    connectOrCreate?: MeetingCreateOrConnectWithoutOrganizerInput | MeetingCreateOrConnectWithoutOrganizerInput[]
    upsert?: MeetingUpsertWithWhereUniqueWithoutOrganizerInput | MeetingUpsertWithWhereUniqueWithoutOrganizerInput[]
    createMany?: MeetingCreateManyOrganizerInputEnvelope
    set?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    disconnect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    delete?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    connect?: MeetingWhereUniqueInput | MeetingWhereUniqueInput[]
    update?: MeetingUpdateWithWhereUniqueWithoutOrganizerInput | MeetingUpdateWithWhereUniqueWithoutOrganizerInput[]
    updateMany?: MeetingUpdateManyWithWhereWithoutOrganizerInput | MeetingUpdateManyWithWhereWithoutOrganizerInput[]
    deleteMany?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
  }

  export type ActionItemUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput> | ActionItemCreateWithoutOwnerInput[] | ActionItemUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutOwnerInput | ActionItemCreateOrConnectWithoutOwnerInput[]
    upsert?: ActionItemUpsertWithWhereUniqueWithoutOwnerInput | ActionItemUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: ActionItemCreateManyOwnerInputEnvelope
    set?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    disconnect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    delete?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    update?: ActionItemUpdateWithWhereUniqueWithoutOwnerInput | ActionItemUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: ActionItemUpdateManyWithWhereWithoutOwnerInput | ActionItemUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutOrganizedMeetingsInput = {
    create?: XOR<UserCreateWithoutOrganizedMeetingsInput, UserUncheckedCreateWithoutOrganizedMeetingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganizedMeetingsInput
    connect?: UserWhereUniqueInput
  }

  export type MeetingParticipantCreateNestedManyWithoutMeetingInput = {
    create?: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput> | MeetingParticipantCreateWithoutMeetingInput[] | MeetingParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingParticipantCreateOrConnectWithoutMeetingInput | MeetingParticipantCreateOrConnectWithoutMeetingInput[]
    createMany?: MeetingParticipantCreateManyMeetingInputEnvelope
    connect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
  }

  export type AudioFileCreateNestedManyWithoutMeetingInput = {
    create?: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput> | AudioFileCreateWithoutMeetingInput[] | AudioFileUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AudioFileCreateOrConnectWithoutMeetingInput | AudioFileCreateOrConnectWithoutMeetingInput[]
    createMany?: AudioFileCreateManyMeetingInputEnvelope
    connect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
  }

  export type TranscriptCreateNestedOneWithoutMeetingInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    connect?: TranscriptWhereUniqueInput
  }

  export type MomCreateNestedOneWithoutMeetingInput = {
    create?: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MomCreateOrConnectWithoutMeetingInput
    connect?: MomWhereUniqueInput
  }

  export type ActionItemCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput> | ActionItemCreateWithoutMeetingInput[] | ActionItemUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutMeetingInput | ActionItemCreateOrConnectWithoutMeetingInput[]
    createMany?: ActionItemCreateManyMeetingInputEnvelope
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
  }

  export type DecisionCreateNestedManyWithoutMeetingInput = {
    create?: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput> | DecisionCreateWithoutMeetingInput[] | DecisionUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: DecisionCreateOrConnectWithoutMeetingInput | DecisionCreateOrConnectWithoutMeetingInput[]
    createMany?: DecisionCreateManyMeetingInputEnvelope
    connect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
  }

  export type SummaryCreateNestedOneWithoutMeetingInput = {
    create?: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: SummaryCreateOrConnectWithoutMeetingInput
    connect?: SummaryWhereUniqueInput
  }

  export type AuditLogCreateNestedManyWithoutMeetingInput = {
    create?: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput> | AuditLogCreateWithoutMeetingInput[] | AuditLogUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutMeetingInput | AuditLogCreateOrConnectWithoutMeetingInput[]
    createMany?: AuditLogCreateManyMeetingInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type MeetingInviteCreateNestedManyWithoutMeetingInput = {
    create?: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput> | MeetingInviteCreateWithoutMeetingInput[] | MeetingInviteUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingInviteCreateOrConnectWithoutMeetingInput | MeetingInviteCreateOrConnectWithoutMeetingInput[]
    createMany?: MeetingInviteCreateManyMeetingInputEnvelope
    connect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
  }

  export type MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput> | MeetingParticipantCreateWithoutMeetingInput[] | MeetingParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingParticipantCreateOrConnectWithoutMeetingInput | MeetingParticipantCreateOrConnectWithoutMeetingInput[]
    createMany?: MeetingParticipantCreateManyMeetingInputEnvelope
    connect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
  }

  export type AudioFileUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput> | AudioFileCreateWithoutMeetingInput[] | AudioFileUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AudioFileCreateOrConnectWithoutMeetingInput | AudioFileCreateOrConnectWithoutMeetingInput[]
    createMany?: AudioFileCreateManyMeetingInputEnvelope
    connect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
  }

  export type TranscriptUncheckedCreateNestedOneWithoutMeetingInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    connect?: TranscriptWhereUniqueInput
  }

  export type MomUncheckedCreateNestedOneWithoutMeetingInput = {
    create?: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MomCreateOrConnectWithoutMeetingInput
    connect?: MomWhereUniqueInput
  }

  export type ActionItemUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput> | ActionItemCreateWithoutMeetingInput[] | ActionItemUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutMeetingInput | ActionItemCreateOrConnectWithoutMeetingInput[]
    createMany?: ActionItemCreateManyMeetingInputEnvelope
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
  }

  export type DecisionUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput> | DecisionCreateWithoutMeetingInput[] | DecisionUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: DecisionCreateOrConnectWithoutMeetingInput | DecisionCreateOrConnectWithoutMeetingInput[]
    createMany?: DecisionCreateManyMeetingInputEnvelope
    connect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
  }

  export type SummaryUncheckedCreateNestedOneWithoutMeetingInput = {
    create?: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: SummaryCreateOrConnectWithoutMeetingInput
    connect?: SummaryWhereUniqueInput
  }

  export type AuditLogUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput> | AuditLogCreateWithoutMeetingInput[] | AuditLogUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutMeetingInput | AuditLogCreateOrConnectWithoutMeetingInput[]
    createMany?: AuditLogCreateManyMeetingInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput = {
    create?: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput> | MeetingInviteCreateWithoutMeetingInput[] | MeetingInviteUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingInviteCreateOrConnectWithoutMeetingInput | MeetingInviteCreateOrConnectWithoutMeetingInput[]
    createMany?: MeetingInviteCreateManyMeetingInputEnvelope
    connect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumMeetingStatusFieldUpdateOperationsInput = {
    set?: $Enums.MeetingStatus
  }

  export type EnumMeetingTagFieldUpdateOperationsInput = {
    set?: $Enums.MeetingTag
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type UserUpdateOneWithoutOrganizedMeetingsNestedInput = {
    create?: XOR<UserCreateWithoutOrganizedMeetingsInput, UserUncheckedCreateWithoutOrganizedMeetingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutOrganizedMeetingsInput
    upsert?: UserUpsertWithoutOrganizedMeetingsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOrganizedMeetingsInput, UserUpdateWithoutOrganizedMeetingsInput>, UserUncheckedUpdateWithoutOrganizedMeetingsInput>
  }

  export type MeetingParticipantUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput> | MeetingParticipantCreateWithoutMeetingInput[] | MeetingParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingParticipantCreateOrConnectWithoutMeetingInput | MeetingParticipantCreateOrConnectWithoutMeetingInput[]
    upsert?: MeetingParticipantUpsertWithWhereUniqueWithoutMeetingInput | MeetingParticipantUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: MeetingParticipantCreateManyMeetingInputEnvelope
    set?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    disconnect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    delete?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    connect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    update?: MeetingParticipantUpdateWithWhereUniqueWithoutMeetingInput | MeetingParticipantUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: MeetingParticipantUpdateManyWithWhereWithoutMeetingInput | MeetingParticipantUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: MeetingParticipantScalarWhereInput | MeetingParticipantScalarWhereInput[]
  }

  export type AudioFileUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput> | AudioFileCreateWithoutMeetingInput[] | AudioFileUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AudioFileCreateOrConnectWithoutMeetingInput | AudioFileCreateOrConnectWithoutMeetingInput[]
    upsert?: AudioFileUpsertWithWhereUniqueWithoutMeetingInput | AudioFileUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: AudioFileCreateManyMeetingInputEnvelope
    set?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    disconnect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    delete?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    connect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    update?: AudioFileUpdateWithWhereUniqueWithoutMeetingInput | AudioFileUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: AudioFileUpdateManyWithWhereWithoutMeetingInput | AudioFileUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: AudioFileScalarWhereInput | AudioFileScalarWhereInput[]
  }

  export type TranscriptUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    upsert?: TranscriptUpsertWithoutMeetingInput
    disconnect?: TranscriptWhereInput | boolean
    delete?: TranscriptWhereInput | boolean
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutMeetingInput, TranscriptUpdateWithoutMeetingInput>, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type MomUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MomCreateOrConnectWithoutMeetingInput
    upsert?: MomUpsertWithoutMeetingInput
    disconnect?: MomWhereInput | boolean
    delete?: MomWhereInput | boolean
    connect?: MomWhereUniqueInput
    update?: XOR<XOR<MomUpdateToOneWithWhereWithoutMeetingInput, MomUpdateWithoutMeetingInput>, MomUncheckedUpdateWithoutMeetingInput>
  }

  export type ActionItemUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput> | ActionItemCreateWithoutMeetingInput[] | ActionItemUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutMeetingInput | ActionItemCreateOrConnectWithoutMeetingInput[]
    upsert?: ActionItemUpsertWithWhereUniqueWithoutMeetingInput | ActionItemUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ActionItemCreateManyMeetingInputEnvelope
    set?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    disconnect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    delete?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    update?: ActionItemUpdateWithWhereUniqueWithoutMeetingInput | ActionItemUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ActionItemUpdateManyWithWhereWithoutMeetingInput | ActionItemUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
  }

  export type DecisionUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput> | DecisionCreateWithoutMeetingInput[] | DecisionUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: DecisionCreateOrConnectWithoutMeetingInput | DecisionCreateOrConnectWithoutMeetingInput[]
    upsert?: DecisionUpsertWithWhereUniqueWithoutMeetingInput | DecisionUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: DecisionCreateManyMeetingInputEnvelope
    set?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    disconnect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    delete?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    connect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    update?: DecisionUpdateWithWhereUniqueWithoutMeetingInput | DecisionUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: DecisionUpdateManyWithWhereWithoutMeetingInput | DecisionUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: DecisionScalarWhereInput | DecisionScalarWhereInput[]
  }

  export type SummaryUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: SummaryCreateOrConnectWithoutMeetingInput
    upsert?: SummaryUpsertWithoutMeetingInput
    disconnect?: SummaryWhereInput | boolean
    delete?: SummaryWhereInput | boolean
    connect?: SummaryWhereUniqueInput
    update?: XOR<XOR<SummaryUpdateToOneWithWhereWithoutMeetingInput, SummaryUpdateWithoutMeetingInput>, SummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type AuditLogUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput> | AuditLogCreateWithoutMeetingInput[] | AuditLogUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutMeetingInput | AuditLogCreateOrConnectWithoutMeetingInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutMeetingInput | AuditLogUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: AuditLogCreateManyMeetingInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutMeetingInput | AuditLogUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutMeetingInput | AuditLogUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type MeetingInviteUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput> | MeetingInviteCreateWithoutMeetingInput[] | MeetingInviteUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingInviteCreateOrConnectWithoutMeetingInput | MeetingInviteCreateOrConnectWithoutMeetingInput[]
    upsert?: MeetingInviteUpsertWithWhereUniqueWithoutMeetingInput | MeetingInviteUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: MeetingInviteCreateManyMeetingInputEnvelope
    set?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    disconnect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    delete?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    connect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    update?: MeetingInviteUpdateWithWhereUniqueWithoutMeetingInput | MeetingInviteUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: MeetingInviteUpdateManyWithWhereWithoutMeetingInput | MeetingInviteUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: MeetingInviteScalarWhereInput | MeetingInviteScalarWhereInput[]
  }

  export type MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput> | MeetingParticipantCreateWithoutMeetingInput[] | MeetingParticipantUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingParticipantCreateOrConnectWithoutMeetingInput | MeetingParticipantCreateOrConnectWithoutMeetingInput[]
    upsert?: MeetingParticipantUpsertWithWhereUniqueWithoutMeetingInput | MeetingParticipantUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: MeetingParticipantCreateManyMeetingInputEnvelope
    set?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    disconnect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    delete?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    connect?: MeetingParticipantWhereUniqueInput | MeetingParticipantWhereUniqueInput[]
    update?: MeetingParticipantUpdateWithWhereUniqueWithoutMeetingInput | MeetingParticipantUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: MeetingParticipantUpdateManyWithWhereWithoutMeetingInput | MeetingParticipantUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: MeetingParticipantScalarWhereInput | MeetingParticipantScalarWhereInput[]
  }

  export type AudioFileUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput> | AudioFileCreateWithoutMeetingInput[] | AudioFileUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AudioFileCreateOrConnectWithoutMeetingInput | AudioFileCreateOrConnectWithoutMeetingInput[]
    upsert?: AudioFileUpsertWithWhereUniqueWithoutMeetingInput | AudioFileUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: AudioFileCreateManyMeetingInputEnvelope
    set?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    disconnect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    delete?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    connect?: AudioFileWhereUniqueInput | AudioFileWhereUniqueInput[]
    update?: AudioFileUpdateWithWhereUniqueWithoutMeetingInput | AudioFileUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: AudioFileUpdateManyWithWhereWithoutMeetingInput | AudioFileUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: AudioFileScalarWhereInput | AudioFileScalarWhereInput[]
  }

  export type TranscriptUncheckedUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutMeetingInput
    upsert?: TranscriptUpsertWithoutMeetingInput
    disconnect?: TranscriptWhereInput | boolean
    delete?: TranscriptWhereInput | boolean
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutMeetingInput, TranscriptUpdateWithoutMeetingInput>, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type MomUncheckedUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: MomCreateOrConnectWithoutMeetingInput
    upsert?: MomUpsertWithoutMeetingInput
    disconnect?: MomWhereInput | boolean
    delete?: MomWhereInput | boolean
    connect?: MomWhereUniqueInput
    update?: XOR<XOR<MomUpdateToOneWithWhereWithoutMeetingInput, MomUpdateWithoutMeetingInput>, MomUncheckedUpdateWithoutMeetingInput>
  }

  export type ActionItemUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput> | ActionItemCreateWithoutMeetingInput[] | ActionItemUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: ActionItemCreateOrConnectWithoutMeetingInput | ActionItemCreateOrConnectWithoutMeetingInput[]
    upsert?: ActionItemUpsertWithWhereUniqueWithoutMeetingInput | ActionItemUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: ActionItemCreateManyMeetingInputEnvelope
    set?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    disconnect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    delete?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    connect?: ActionItemWhereUniqueInput | ActionItemWhereUniqueInput[]
    update?: ActionItemUpdateWithWhereUniqueWithoutMeetingInput | ActionItemUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: ActionItemUpdateManyWithWhereWithoutMeetingInput | ActionItemUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
  }

  export type DecisionUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput> | DecisionCreateWithoutMeetingInput[] | DecisionUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: DecisionCreateOrConnectWithoutMeetingInput | DecisionCreateOrConnectWithoutMeetingInput[]
    upsert?: DecisionUpsertWithWhereUniqueWithoutMeetingInput | DecisionUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: DecisionCreateManyMeetingInputEnvelope
    set?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    disconnect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    delete?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    connect?: DecisionWhereUniqueInput | DecisionWhereUniqueInput[]
    update?: DecisionUpdateWithWhereUniqueWithoutMeetingInput | DecisionUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: DecisionUpdateManyWithWhereWithoutMeetingInput | DecisionUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: DecisionScalarWhereInput | DecisionScalarWhereInput[]
  }

  export type SummaryUncheckedUpdateOneWithoutMeetingNestedInput = {
    create?: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
    connectOrCreate?: SummaryCreateOrConnectWithoutMeetingInput
    upsert?: SummaryUpsertWithoutMeetingInput
    disconnect?: SummaryWhereInput | boolean
    delete?: SummaryWhereInput | boolean
    connect?: SummaryWhereUniqueInput
    update?: XOR<XOR<SummaryUpdateToOneWithWhereWithoutMeetingInput, SummaryUpdateWithoutMeetingInput>, SummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type AuditLogUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput> | AuditLogCreateWithoutMeetingInput[] | AuditLogUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutMeetingInput | AuditLogCreateOrConnectWithoutMeetingInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutMeetingInput | AuditLogUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: AuditLogCreateManyMeetingInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutMeetingInput | AuditLogUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutMeetingInput | AuditLogUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput = {
    create?: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput> | MeetingInviteCreateWithoutMeetingInput[] | MeetingInviteUncheckedCreateWithoutMeetingInput[]
    connectOrCreate?: MeetingInviteCreateOrConnectWithoutMeetingInput | MeetingInviteCreateOrConnectWithoutMeetingInput[]
    upsert?: MeetingInviteUpsertWithWhereUniqueWithoutMeetingInput | MeetingInviteUpsertWithWhereUniqueWithoutMeetingInput[]
    createMany?: MeetingInviteCreateManyMeetingInputEnvelope
    set?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    disconnect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    delete?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    connect?: MeetingInviteWhereUniqueInput | MeetingInviteWhereUniqueInput[]
    update?: MeetingInviteUpdateWithWhereUniqueWithoutMeetingInput | MeetingInviteUpdateWithWhereUniqueWithoutMeetingInput[]
    updateMany?: MeetingInviteUpdateManyWithWhereWithoutMeetingInput | MeetingInviteUpdateManyWithWhereWithoutMeetingInput[]
    deleteMany?: MeetingInviteScalarWhereInput | MeetingInviteScalarWhereInput[]
  }

  export type MeetingCreateNestedOneWithoutInvitesInput = {
    create?: XOR<MeetingCreateWithoutInvitesInput, MeetingUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutInvitesInput
    connect?: MeetingWhereUniqueInput
  }

  export type EnumInviteStatusFieldUpdateOperationsInput = {
    set?: $Enums.InviteStatus
  }

  export type MeetingUpdateOneRequiredWithoutInvitesNestedInput = {
    create?: XOR<MeetingCreateWithoutInvitesInput, MeetingUncheckedCreateWithoutInvitesInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutInvitesInput
    upsert?: MeetingUpsertWithoutInvitesInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutInvitesInput, MeetingUpdateWithoutInvitesInput>, MeetingUncheckedUpdateWithoutInvitesInput>
  }

  export type MeetingCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutParticipantsInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutParticipantsInput
    upsert?: MeetingUpsertWithoutParticipantsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutParticipantsInput, MeetingUpdateWithoutParticipantsInput>, MeetingUncheckedUpdateWithoutParticipantsInput>
  }

  export type MeetingCreateNestedOneWithoutAudioFilesInput = {
    create?: XOR<MeetingCreateWithoutAudioFilesInput, MeetingUncheckedCreateWithoutAudioFilesInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutAudioFilesInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutAudioFilesNestedInput = {
    create?: XOR<MeetingCreateWithoutAudioFilesInput, MeetingUncheckedCreateWithoutAudioFilesInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutAudioFilesInput
    upsert?: MeetingUpsertWithoutAudioFilesInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutAudioFilesInput, MeetingUpdateWithoutAudioFilesInput>, MeetingUncheckedUpdateWithoutAudioFilesInput>
  }

  export type MeetingCreateNestedOneWithoutTranscriptInput = {
    create?: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutTranscriptInput
    connect?: MeetingWhereUniqueInput
  }

  export type TranscriptSegmentCreateNestedManyWithoutTranscriptInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
  }

  export type MeetingUpdateOneRequiredWithoutTranscriptNestedInput = {
    create?: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutTranscriptInput
    upsert?: MeetingUpsertWithoutTranscriptInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutTranscriptInput, MeetingUpdateWithoutTranscriptInput>, MeetingUncheckedUpdateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateManyWithoutTranscriptNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput | TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput = {
    create?: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput> | TranscriptSegmentCreateWithoutTranscriptInput[] | TranscriptSegmentUncheckedCreateWithoutTranscriptInput[]
    connectOrCreate?: TranscriptSegmentCreateOrConnectWithoutTranscriptInput | TranscriptSegmentCreateOrConnectWithoutTranscriptInput[]
    upsert?: TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput[]
    createMany?: TranscriptSegmentCreateManyTranscriptInputEnvelope
    set?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    disconnect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    delete?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    connect?: TranscriptSegmentWhereUniqueInput | TranscriptSegmentWhereUniqueInput[]
    update?: TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput | TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput[]
    updateMany?: TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput | TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput[]
    deleteMany?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
  }

  export type TranscriptCreateNestedOneWithoutSegmentsInput = {
    create?: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutSegmentsInput
    connect?: TranscriptWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TranscriptUpdateOneRequiredWithoutSegmentsNestedInput = {
    create?: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    connectOrCreate?: TranscriptCreateOrConnectWithoutSegmentsInput
    upsert?: TranscriptUpsertWithoutSegmentsInput
    connect?: TranscriptWhereUniqueInput
    update?: XOR<XOR<TranscriptUpdateToOneWithWhereWithoutSegmentsInput, TranscriptUpdateWithoutSegmentsInput>, TranscriptUncheckedUpdateWithoutSegmentsInput>
  }

  export type MeetingCreateNestedOneWithoutMomInput = {
    create?: XOR<MeetingCreateWithoutMomInput, MeetingUncheckedCreateWithoutMomInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutMomInput
    connect?: MeetingWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type MeetingUpdateOneRequiredWithoutMomNestedInput = {
    create?: XOR<MeetingCreateWithoutMomInput, MeetingUncheckedCreateWithoutMomInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutMomInput
    upsert?: MeetingUpsertWithoutMomInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutMomInput, MeetingUpdateWithoutMomInput>, MeetingUncheckedUpdateWithoutMomInput>
  }

  export type MeetingCreateNestedOneWithoutActionItemsInput = {
    create?: XOR<MeetingCreateWithoutActionItemsInput, MeetingUncheckedCreateWithoutActionItemsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutActionItemsInput
    connect?: MeetingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutOwnedTasksInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTaskPriorityFieldUpdateOperationsInput = {
    set?: $Enums.TaskPriority
  }

  export type EnumTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.TaskStatus
  }

  export type MeetingUpdateOneRequiredWithoutActionItemsNestedInput = {
    create?: XOR<MeetingCreateWithoutActionItemsInput, MeetingUncheckedCreateWithoutActionItemsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutActionItemsInput
    upsert?: MeetingUpsertWithoutActionItemsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutActionItemsInput, MeetingUpdateWithoutActionItemsInput>, MeetingUncheckedUpdateWithoutActionItemsInput>
  }

  export type UserUpdateOneWithoutOwnedTasksNestedInput = {
    create?: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    connectOrCreate?: UserCreateOrConnectWithoutOwnedTasksInput
    upsert?: UserUpsertWithoutOwnedTasksInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutOwnedTasksInput, UserUpdateWithoutOwnedTasksInput>, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type MeetingCreateNestedOneWithoutDecisionsInput = {
    create?: XOR<MeetingCreateWithoutDecisionsInput, MeetingUncheckedCreateWithoutDecisionsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutDecisionsInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutDecisionsNestedInput = {
    create?: XOR<MeetingCreateWithoutDecisionsInput, MeetingUncheckedCreateWithoutDecisionsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutDecisionsInput
    upsert?: MeetingUpsertWithoutDecisionsInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutDecisionsInput, MeetingUpdateWithoutDecisionsInput>, MeetingUncheckedUpdateWithoutDecisionsInput>
  }

  export type MeetingCreateNestedOneWithoutSummaryInput = {
    create?: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutSummaryInput
    connect?: MeetingWhereUniqueInput
  }

  export type MeetingUpdateOneRequiredWithoutSummaryNestedInput = {
    create?: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutSummaryInput
    upsert?: MeetingUpsertWithoutSummaryInput
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutSummaryInput, MeetingUpdateWithoutSummaryInput>, MeetingUncheckedUpdateWithoutSummaryInput>
  }

  export type MeetingCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<MeetingCreateWithoutAuditLogsInput, MeetingUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutAuditLogsInput
    connect?: MeetingWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumPipelineStepFieldUpdateOperationsInput = {
    set?: $Enums.PipelineStep
  }

  export type MeetingUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<MeetingCreateWithoutAuditLogsInput, MeetingUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: MeetingCreateOrConnectWithoutAuditLogsInput
    upsert?: MeetingUpsertWithoutAuditLogsInput
    disconnect?: MeetingWhereInput | boolean
    delete?: MeetingWhereInput | boolean
    connect?: MeetingWhereUniqueInput
    update?: XOR<XOR<MeetingUpdateToOneWithWhereWithoutAuditLogsInput, MeetingUpdateWithoutAuditLogsInput>, MeetingUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
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

  export type NestedEnumMeetingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingStatus | EnumMeetingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingStatusFilter<$PrismaModel> | $Enums.MeetingStatus
  }

  export type NestedEnumMeetingTagFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingTag | EnumMeetingTagFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingTagFilter<$PrismaModel> | $Enums.MeetingTag
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

  export type NestedEnumMeetingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingStatus | EnumMeetingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingStatus[] | ListEnumMeetingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingStatusWithAggregatesFilter<$PrismaModel> | $Enums.MeetingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMeetingStatusFilter<$PrismaModel>
    _max?: NestedEnumMeetingStatusFilter<$PrismaModel>
  }

  export type NestedEnumMeetingTagWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MeetingTag | EnumMeetingTagFieldRefInput<$PrismaModel>
    in?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    notIn?: $Enums.MeetingTag[] | ListEnumMeetingTagFieldRefInput<$PrismaModel>
    not?: NestedEnumMeetingTagWithAggregatesFilter<$PrismaModel> | $Enums.MeetingTag
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMeetingTagFilter<$PrismaModel>
    _max?: NestedEnumMeetingTagFilter<$PrismaModel>
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

  export type NestedEnumInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | EnumInviteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInviteStatusFilter<$PrismaModel> | $Enums.InviteStatus
  }

  export type NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InviteStatus | EnumInviteStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InviteStatus[] | ListEnumInviteStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.InviteStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInviteStatusFilter<$PrismaModel>
    _max?: NestedEnumInviteStatusFilter<$PrismaModel>
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

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumTaskPriorityFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | EnumTaskPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskPriorityFilter<$PrismaModel> | $Enums.TaskPriority
  }

  export type NestedEnumTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusFilter<$PrismaModel> | $Enums.TaskStatus
  }

  export type NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskPriority | EnumTaskPriorityFieldRefInput<$PrismaModel>
    in?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskPriority[] | ListEnumTaskPriorityFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskPriorityWithAggregatesFilter<$PrismaModel> | $Enums.TaskPriority
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskPriorityFilter<$PrismaModel>
    _max?: NestedEnumTaskPriorityFilter<$PrismaModel>
  }

  export type NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskStatus | EnumTaskStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TaskStatus[] | ListEnumTaskStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.TaskStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTaskStatusFilter<$PrismaModel>
    _max?: NestedEnumTaskStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumPipelineStepFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStep | EnumPipelineStepFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStepFilter<$PrismaModel> | $Enums.PipelineStep
  }

  export type NestedEnumPipelineStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PipelineStep | EnumPipelineStepFieldRefInput<$PrismaModel>
    in?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    notIn?: $Enums.PipelineStep[] | ListEnumPipelineStepFieldRefInput<$PrismaModel>
    not?: NestedEnumPipelineStepWithAggregatesFilter<$PrismaModel> | $Enums.PipelineStep
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPipelineStepFilter<$PrismaModel>
    _max?: NestedEnumPipelineStepFilter<$PrismaModel>
  }

  export type MeetingCreateWithoutOrganizerInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutOrganizerInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutOrganizerInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput>
  }

  export type MeetingCreateManyOrganizerInputEnvelope = {
    data: MeetingCreateManyOrganizerInput | MeetingCreateManyOrganizerInput[]
    skipDuplicates?: boolean
  }

  export type ActionItemCreateWithoutOwnerInput = {
    id?: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutActionItemsInput
  }

  export type ActionItemUncheckedCreateWithoutOwnerInput = {
    id?: string
    meetingId: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionItemCreateOrConnectWithoutOwnerInput = {
    where: ActionItemWhereUniqueInput
    create: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput>
  }

  export type ActionItemCreateManyOwnerInputEnvelope = {
    data: ActionItemCreateManyOwnerInput | ActionItemCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type AuditLogCreateWithoutUserInput = {
    id?: string
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    meeting?: MeetingCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: string
    meetingId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MeetingUpsertWithWhereUniqueWithoutOrganizerInput = {
    where: MeetingWhereUniqueInput
    update: XOR<MeetingUpdateWithoutOrganizerInput, MeetingUncheckedUpdateWithoutOrganizerInput>
    create: XOR<MeetingCreateWithoutOrganizerInput, MeetingUncheckedCreateWithoutOrganizerInput>
  }

  export type MeetingUpdateWithWhereUniqueWithoutOrganizerInput = {
    where: MeetingWhereUniqueInput
    data: XOR<MeetingUpdateWithoutOrganizerInput, MeetingUncheckedUpdateWithoutOrganizerInput>
  }

  export type MeetingUpdateManyWithWhereWithoutOrganizerInput = {
    where: MeetingScalarWhereInput
    data: XOR<MeetingUpdateManyMutationInput, MeetingUncheckedUpdateManyWithoutOrganizerInput>
  }

  export type MeetingScalarWhereInput = {
    AND?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
    OR?: MeetingScalarWhereInput[]
    NOT?: MeetingScalarWhereInput | MeetingScalarWhereInput[]
    id?: StringFilter<"Meeting"> | string
    title?: StringFilter<"Meeting"> | string
    description?: StringFilter<"Meeting"> | string
    scheduledAt?: DateTimeFilter<"Meeting"> | Date | string
    durationMinutes?: IntFilter<"Meeting"> | number
    status?: EnumMeetingStatusFilter<"Meeting"> | $Enums.MeetingStatus
    tag?: EnumMeetingTagFilter<"Meeting"> | $Enums.MeetingTag
    notes?: StringFilter<"Meeting"> | string
    calendarEventId?: StringNullableFilter<"Meeting"> | string | null
    recordingUrl?: StringNullableFilter<"Meeting"> | string | null
    organizerId?: StringNullableFilter<"Meeting"> | string | null
    createdAt?: DateTimeFilter<"Meeting"> | Date | string
    updatedAt?: DateTimeFilter<"Meeting"> | Date | string
  }

  export type ActionItemUpsertWithWhereUniqueWithoutOwnerInput = {
    where: ActionItemWhereUniqueInput
    update: XOR<ActionItemUpdateWithoutOwnerInput, ActionItemUncheckedUpdateWithoutOwnerInput>
    create: XOR<ActionItemCreateWithoutOwnerInput, ActionItemUncheckedCreateWithoutOwnerInput>
  }

  export type ActionItemUpdateWithWhereUniqueWithoutOwnerInput = {
    where: ActionItemWhereUniqueInput
    data: XOR<ActionItemUpdateWithoutOwnerInput, ActionItemUncheckedUpdateWithoutOwnerInput>
  }

  export type ActionItemUpdateManyWithWhereWithoutOwnerInput = {
    where: ActionItemScalarWhereInput
    data: XOR<ActionItemUpdateManyMutationInput, ActionItemUncheckedUpdateManyWithoutOwnerInput>
  }

  export type ActionItemScalarWhereInput = {
    AND?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
    OR?: ActionItemScalarWhereInput[]
    NOT?: ActionItemScalarWhereInput | ActionItemScalarWhereInput[]
    id?: StringFilter<"ActionItem"> | string
    meetingId?: StringFilter<"ActionItem"> | string
    description?: StringFilter<"ActionItem"> | string
    ownerName?: StringNullableFilter<"ActionItem"> | string | null
    ownerEmail?: StringNullableFilter<"ActionItem"> | string | null
    ownerId?: StringNullableFilter<"ActionItem"> | string | null
    dueDate?: DateTimeNullableFilter<"ActionItem"> | Date | string | null
    priority?: EnumTaskPriorityFilter<"ActionItem"> | $Enums.TaskPriority
    status?: EnumTaskStatusFilter<"ActionItem"> | $Enums.TaskStatus
    confidence?: FloatNullableFilter<"ActionItem"> | number | null
    externalId?: StringNullableFilter<"ActionItem"> | string | null
    externalUrl?: StringNullableFilter<"ActionItem"> | string | null
    createdAt?: DateTimeFilter<"ActionItem"> | Date | string
    updatedAt?: DateTimeFilter<"ActionItem"> | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    meetingId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    action?: EnumPipelineStepFilter<"AuditLog"> | $Enums.PipelineStep
    details?: JsonNullableFilter<"AuditLog">
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
  }

  export type UserCreateWithoutOrganizedMeetingsInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: ActionItemCreateNestedManyWithoutOwnerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrganizedMeetingsInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    ownedTasks?: ActionItemUncheckedCreateNestedManyWithoutOwnerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrganizedMeetingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizedMeetingsInput, UserUncheckedCreateWithoutOrganizedMeetingsInput>
  }

  export type MeetingParticipantCreateWithoutMeetingInput = {
    id?: string
    name: string
    email: string
    role?: string | null
  }

  export type MeetingParticipantUncheckedCreateWithoutMeetingInput = {
    id?: string
    name: string
    email: string
    role?: string | null
  }

  export type MeetingParticipantCreateOrConnectWithoutMeetingInput = {
    where: MeetingParticipantWhereUniqueInput
    create: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput>
  }

  export type MeetingParticipantCreateManyMeetingInputEnvelope = {
    data: MeetingParticipantCreateManyMeetingInput | MeetingParticipantCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type AudioFileCreateWithoutMeetingInput = {
    id?: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
  }

  export type AudioFileUncheckedCreateWithoutMeetingInput = {
    id?: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
  }

  export type AudioFileCreateOrConnectWithoutMeetingInput = {
    where: AudioFileWhereUniqueInput
    create: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput>
  }

  export type AudioFileCreateManyMeetingInputEnvelope = {
    data: AudioFileCreateManyMeetingInput | AudioFileCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type TranscriptCreateWithoutMeetingInput = {
    id?: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    segments?: TranscriptSegmentCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateWithoutMeetingInput = {
    id?: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    segments?: TranscriptSegmentUncheckedCreateNestedManyWithoutTranscriptInput
  }

  export type TranscriptCreateOrConnectWithoutMeetingInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
  }

  export type MomCreateWithoutMeetingInput = {
    id?: string
    title: string
    dateTime: string
    participants: JsonNullValueInput | InputJsonValue
    keyPoints: JsonNullValueInput | InputJsonValue
    actionItems: JsonNullValueInput | InputJsonValue
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    shared?: boolean
    lastEditedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MomUncheckedCreateWithoutMeetingInput = {
    id?: string
    title: string
    dateTime: string
    participants: JsonNullValueInput | InputJsonValue
    keyPoints: JsonNullValueInput | InputJsonValue
    actionItems: JsonNullValueInput | InputJsonValue
    approved?: boolean
    approvedBy?: string | null
    approvedAt?: Date | string | null
    shared?: boolean
    lastEditedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MomCreateOrConnectWithoutMeetingInput = {
    where: MomWhereUniqueInput
    create: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
  }

  export type ActionItemCreateWithoutMeetingInput = {
    id?: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    owner?: UserCreateNestedOneWithoutOwnedTasksInput
  }

  export type ActionItemUncheckedCreateWithoutMeetingInput = {
    id?: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    ownerId?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionItemCreateOrConnectWithoutMeetingInput = {
    where: ActionItemWhereUniqueInput
    create: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput>
  }

  export type ActionItemCreateManyMeetingInputEnvelope = {
    data: ActionItemCreateManyMeetingInput | ActionItemCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type DecisionCreateWithoutMeetingInput = {
    id?: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
  }

  export type DecisionUncheckedCreateWithoutMeetingInput = {
    id?: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
  }

  export type DecisionCreateOrConnectWithoutMeetingInput = {
    where: DecisionWhereUniqueInput
    create: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput>
  }

  export type DecisionCreateManyMeetingInputEnvelope = {
    data: DecisionCreateManyMeetingInput | DecisionCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type SummaryCreateWithoutMeetingInput = {
    id?: string
    shortSummary: string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SummaryUncheckedCreateWithoutMeetingInput = {
    id?: string
    shortSummary: string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SummaryCreateOrConnectWithoutMeetingInput = {
    where: SummaryWhereUniqueInput
    create: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
  }

  export type AuditLogCreateWithoutMeetingInput = {
    id?: string
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateWithoutMeetingInput = {
    id?: string
    userId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type AuditLogCreateOrConnectWithoutMeetingInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput>
  }

  export type AuditLogCreateManyMeetingInputEnvelope = {
    data: AuditLogCreateManyMeetingInput | AuditLogCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type MeetingInviteCreateWithoutMeetingInput = {
    id?: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
  }

  export type MeetingInviteUncheckedCreateWithoutMeetingInput = {
    id?: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
  }

  export type MeetingInviteCreateOrConnectWithoutMeetingInput = {
    where: MeetingInviteWhereUniqueInput
    create: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput>
  }

  export type MeetingInviteCreateManyMeetingInputEnvelope = {
    data: MeetingInviteCreateManyMeetingInput | MeetingInviteCreateManyMeetingInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutOrganizedMeetingsInput = {
    update: XOR<UserUpdateWithoutOrganizedMeetingsInput, UserUncheckedUpdateWithoutOrganizedMeetingsInput>
    create: XOR<UserCreateWithoutOrganizedMeetingsInput, UserUncheckedCreateWithoutOrganizedMeetingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOrganizedMeetingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOrganizedMeetingsInput, UserUncheckedUpdateWithoutOrganizedMeetingsInput>
  }

  export type UserUpdateWithoutOrganizedMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: ActionItemUpdateManyWithoutOwnerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganizedMeetingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    ownedTasks?: ActionItemUncheckedUpdateManyWithoutOwnerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MeetingParticipantUpsertWithWhereUniqueWithoutMeetingInput = {
    where: MeetingParticipantWhereUniqueInput
    update: XOR<MeetingParticipantUpdateWithoutMeetingInput, MeetingParticipantUncheckedUpdateWithoutMeetingInput>
    create: XOR<MeetingParticipantCreateWithoutMeetingInput, MeetingParticipantUncheckedCreateWithoutMeetingInput>
  }

  export type MeetingParticipantUpdateWithWhereUniqueWithoutMeetingInput = {
    where: MeetingParticipantWhereUniqueInput
    data: XOR<MeetingParticipantUpdateWithoutMeetingInput, MeetingParticipantUncheckedUpdateWithoutMeetingInput>
  }

  export type MeetingParticipantUpdateManyWithWhereWithoutMeetingInput = {
    where: MeetingParticipantScalarWhereInput
    data: XOR<MeetingParticipantUpdateManyMutationInput, MeetingParticipantUncheckedUpdateManyWithoutMeetingInput>
  }

  export type MeetingParticipantScalarWhereInput = {
    AND?: MeetingParticipantScalarWhereInput | MeetingParticipantScalarWhereInput[]
    OR?: MeetingParticipantScalarWhereInput[]
    NOT?: MeetingParticipantScalarWhereInput | MeetingParticipantScalarWhereInput[]
    id?: StringFilter<"MeetingParticipant"> | string
    meetingId?: StringFilter<"MeetingParticipant"> | string
    name?: StringFilter<"MeetingParticipant"> | string
    email?: StringFilter<"MeetingParticipant"> | string
    role?: StringNullableFilter<"MeetingParticipant"> | string | null
  }

  export type AudioFileUpsertWithWhereUniqueWithoutMeetingInput = {
    where: AudioFileWhereUniqueInput
    update: XOR<AudioFileUpdateWithoutMeetingInput, AudioFileUncheckedUpdateWithoutMeetingInput>
    create: XOR<AudioFileCreateWithoutMeetingInput, AudioFileUncheckedCreateWithoutMeetingInput>
  }

  export type AudioFileUpdateWithWhereUniqueWithoutMeetingInput = {
    where: AudioFileWhereUniqueInput
    data: XOR<AudioFileUpdateWithoutMeetingInput, AudioFileUncheckedUpdateWithoutMeetingInput>
  }

  export type AudioFileUpdateManyWithWhereWithoutMeetingInput = {
    where: AudioFileScalarWhereInput
    data: XOR<AudioFileUpdateManyMutationInput, AudioFileUncheckedUpdateManyWithoutMeetingInput>
  }

  export type AudioFileScalarWhereInput = {
    AND?: AudioFileScalarWhereInput | AudioFileScalarWhereInput[]
    OR?: AudioFileScalarWhereInput[]
    NOT?: AudioFileScalarWhereInput | AudioFileScalarWhereInput[]
    id?: StringFilter<"AudioFile"> | string
    meetingId?: StringFilter<"AudioFile"> | string
    storageKey?: StringFilter<"AudioFile"> | string
    mimeType?: StringFilter<"AudioFile"> | string
    sizeBytes?: IntFilter<"AudioFile"> | number
    createdAt?: DateTimeFilter<"AudioFile"> | Date | string
  }

  export type TranscriptUpsertWithoutMeetingInput = {
    update: XOR<TranscriptUpdateWithoutMeetingInput, TranscriptUncheckedUpdateWithoutMeetingInput>
    create: XOR<TranscriptCreateWithoutMeetingInput, TranscriptUncheckedCreateWithoutMeetingInput>
    where?: TranscriptWhereInput
  }

  export type TranscriptUpdateToOneWithWhereWithoutMeetingInput = {
    where?: TranscriptWhereInput
    data: XOR<TranscriptUpdateWithoutMeetingInput, TranscriptUncheckedUpdateWithoutMeetingInput>
  }

  export type TranscriptUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUpdateManyWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    segments?: TranscriptSegmentUncheckedUpdateManyWithoutTranscriptNestedInput
  }

  export type MomUpsertWithoutMeetingInput = {
    update: XOR<MomUpdateWithoutMeetingInput, MomUncheckedUpdateWithoutMeetingInput>
    create: XOR<MomCreateWithoutMeetingInput, MomUncheckedCreateWithoutMeetingInput>
    where?: MomWhereInput
  }

  export type MomUpdateToOneWithWhereWithoutMeetingInput = {
    where?: MomWhereInput
    data: XOR<MomUpdateWithoutMeetingInput, MomUncheckedUpdateWithoutMeetingInput>
  }

  export type MomUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MomUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    dateTime?: StringFieldUpdateOperationsInput | string
    participants?: JsonNullValueInput | InputJsonValue
    keyPoints?: JsonNullValueInput | InputJsonValue
    actionItems?: JsonNullValueInput | InputJsonValue
    approved?: BoolFieldUpdateOperationsInput | boolean
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    shared?: BoolFieldUpdateOperationsInput | boolean
    lastEditedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUpsertWithWhereUniqueWithoutMeetingInput = {
    where: ActionItemWhereUniqueInput
    update: XOR<ActionItemUpdateWithoutMeetingInput, ActionItemUncheckedUpdateWithoutMeetingInput>
    create: XOR<ActionItemCreateWithoutMeetingInput, ActionItemUncheckedCreateWithoutMeetingInput>
  }

  export type ActionItemUpdateWithWhereUniqueWithoutMeetingInput = {
    where: ActionItemWhereUniqueInput
    data: XOR<ActionItemUpdateWithoutMeetingInput, ActionItemUncheckedUpdateWithoutMeetingInput>
  }

  export type ActionItemUpdateManyWithWhereWithoutMeetingInput = {
    where: ActionItemScalarWhereInput
    data: XOR<ActionItemUpdateManyMutationInput, ActionItemUncheckedUpdateManyWithoutMeetingInput>
  }

  export type DecisionUpsertWithWhereUniqueWithoutMeetingInput = {
    where: DecisionWhereUniqueInput
    update: XOR<DecisionUpdateWithoutMeetingInput, DecisionUncheckedUpdateWithoutMeetingInput>
    create: XOR<DecisionCreateWithoutMeetingInput, DecisionUncheckedCreateWithoutMeetingInput>
  }

  export type DecisionUpdateWithWhereUniqueWithoutMeetingInput = {
    where: DecisionWhereUniqueInput
    data: XOR<DecisionUpdateWithoutMeetingInput, DecisionUncheckedUpdateWithoutMeetingInput>
  }

  export type DecisionUpdateManyWithWhereWithoutMeetingInput = {
    where: DecisionScalarWhereInput
    data: XOR<DecisionUpdateManyMutationInput, DecisionUncheckedUpdateManyWithoutMeetingInput>
  }

  export type DecisionScalarWhereInput = {
    AND?: DecisionScalarWhereInput | DecisionScalarWhereInput[]
    OR?: DecisionScalarWhereInput[]
    NOT?: DecisionScalarWhereInput | DecisionScalarWhereInput[]
    id?: StringFilter<"Decision"> | string
    meetingId?: StringFilter<"Decision"> | string
    text?: StringFilter<"Decision"> | string
    timestamp?: FloatNullableFilter<"Decision"> | number | null
    createdAt?: DateTimeFilter<"Decision"> | Date | string
  }

  export type SummaryUpsertWithoutMeetingInput = {
    update: XOR<SummaryUpdateWithoutMeetingInput, SummaryUncheckedUpdateWithoutMeetingInput>
    create: XOR<SummaryCreateWithoutMeetingInput, SummaryUncheckedCreateWithoutMeetingInput>
    where?: SummaryWhereInput
  }

  export type SummaryUpdateToOneWithWhereWithoutMeetingInput = {
    where?: SummaryWhereInput
    data: XOR<SummaryUpdateWithoutMeetingInput, SummaryUncheckedUpdateWithoutMeetingInput>
  }

  export type SummaryUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SummaryUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    shortSummary?: StringFieldUpdateOperationsInput | string
    nextAgenda?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutMeetingInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutMeetingInput, AuditLogUncheckedUpdateWithoutMeetingInput>
    create: XOR<AuditLogCreateWithoutMeetingInput, AuditLogUncheckedCreateWithoutMeetingInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutMeetingInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutMeetingInput, AuditLogUncheckedUpdateWithoutMeetingInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutMeetingInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutMeetingInput>
  }

  export type MeetingInviteUpsertWithWhereUniqueWithoutMeetingInput = {
    where: MeetingInviteWhereUniqueInput
    update: XOR<MeetingInviteUpdateWithoutMeetingInput, MeetingInviteUncheckedUpdateWithoutMeetingInput>
    create: XOR<MeetingInviteCreateWithoutMeetingInput, MeetingInviteUncheckedCreateWithoutMeetingInput>
  }

  export type MeetingInviteUpdateWithWhereUniqueWithoutMeetingInput = {
    where: MeetingInviteWhereUniqueInput
    data: XOR<MeetingInviteUpdateWithoutMeetingInput, MeetingInviteUncheckedUpdateWithoutMeetingInput>
  }

  export type MeetingInviteUpdateManyWithWhereWithoutMeetingInput = {
    where: MeetingInviteScalarWhereInput
    data: XOR<MeetingInviteUpdateManyMutationInput, MeetingInviteUncheckedUpdateManyWithoutMeetingInput>
  }

  export type MeetingInviteScalarWhereInput = {
    AND?: MeetingInviteScalarWhereInput | MeetingInviteScalarWhereInput[]
    OR?: MeetingInviteScalarWhereInput[]
    NOT?: MeetingInviteScalarWhereInput | MeetingInviteScalarWhereInput[]
    id?: StringFilter<"MeetingInvite"> | string
    meetingId?: StringFilter<"MeetingInvite"> | string
    email?: StringFilter<"MeetingInvite"> | string
    name?: StringFilter<"MeetingInvite"> | string
    status?: EnumInviteStatusFilter<"MeetingInvite"> | $Enums.InviteStatus
    error?: StringNullableFilter<"MeetingInvite"> | string | null
    sentAt?: DateTimeFilter<"MeetingInvite"> | Date | string
  }

  export type MeetingCreateWithoutInvitesInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutInvitesInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutInvitesInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutInvitesInput, MeetingUncheckedCreateWithoutInvitesInput>
  }

  export type MeetingUpsertWithoutInvitesInput = {
    update: XOR<MeetingUpdateWithoutInvitesInput, MeetingUncheckedUpdateWithoutInvitesInput>
    create: XOR<MeetingCreateWithoutInvitesInput, MeetingUncheckedCreateWithoutInvitesInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutInvitesInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutInvitesInput, MeetingUncheckedUpdateWithoutInvitesInput>
  }

  export type MeetingUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutInvitesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutParticipantsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutParticipantsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
  }

  export type MeetingUpsertWithoutParticipantsInput = {
    update: XOR<MeetingUpdateWithoutParticipantsInput, MeetingUncheckedUpdateWithoutParticipantsInput>
    create: XOR<MeetingCreateWithoutParticipantsInput, MeetingUncheckedCreateWithoutParticipantsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutParticipantsInput, MeetingUncheckedUpdateWithoutParticipantsInput>
  }

  export type MeetingUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutAudioFilesInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutAudioFilesInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutAudioFilesInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutAudioFilesInput, MeetingUncheckedCreateWithoutAudioFilesInput>
  }

  export type MeetingUpsertWithoutAudioFilesInput = {
    update: XOR<MeetingUpdateWithoutAudioFilesInput, MeetingUncheckedUpdateWithoutAudioFilesInput>
    create: XOR<MeetingCreateWithoutAudioFilesInput, MeetingUncheckedCreateWithoutAudioFilesInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutAudioFilesInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutAudioFilesInput, MeetingUncheckedUpdateWithoutAudioFilesInput>
  }

  export type MeetingUpdateWithoutAudioFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutAudioFilesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutTranscriptInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutTranscriptInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutTranscriptInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentCreateWithoutTranscriptInput = {
    id?: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
  }

  export type TranscriptSegmentUncheckedCreateWithoutTranscriptInput = {
    id?: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
  }

  export type TranscriptSegmentCreateOrConnectWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    create: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentCreateManyTranscriptInputEnvelope = {
    data: TranscriptSegmentCreateManyTranscriptInput | TranscriptSegmentCreateManyTranscriptInput[]
    skipDuplicates?: boolean
  }

  export type MeetingUpsertWithoutTranscriptInput = {
    update: XOR<MeetingUpdateWithoutTranscriptInput, MeetingUncheckedUpdateWithoutTranscriptInput>
    create: XOR<MeetingCreateWithoutTranscriptInput, MeetingUncheckedCreateWithoutTranscriptInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutTranscriptInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutTranscriptInput, MeetingUncheckedUpdateWithoutTranscriptInput>
  }

  export type MeetingUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type TranscriptSegmentUpsertWithWhereUniqueWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    update: XOR<TranscriptSegmentUpdateWithoutTranscriptInput, TranscriptSegmentUncheckedUpdateWithoutTranscriptInput>
    create: XOR<TranscriptSegmentCreateWithoutTranscriptInput, TranscriptSegmentUncheckedCreateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateWithWhereUniqueWithoutTranscriptInput = {
    where: TranscriptSegmentWhereUniqueInput
    data: XOR<TranscriptSegmentUpdateWithoutTranscriptInput, TranscriptSegmentUncheckedUpdateWithoutTranscriptInput>
  }

  export type TranscriptSegmentUpdateManyWithWhereWithoutTranscriptInput = {
    where: TranscriptSegmentScalarWhereInput
    data: XOR<TranscriptSegmentUpdateManyMutationInput, TranscriptSegmentUncheckedUpdateManyWithoutTranscriptInput>
  }

  export type TranscriptSegmentScalarWhereInput = {
    AND?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
    OR?: TranscriptSegmentScalarWhereInput[]
    NOT?: TranscriptSegmentScalarWhereInput | TranscriptSegmentScalarWhereInput[]
    id?: StringFilter<"TranscriptSegment"> | string
    transcriptId?: StringFilter<"TranscriptSegment"> | string
    speaker?: StringFilter<"TranscriptSegment"> | string
    startTime?: FloatFilter<"TranscriptSegment"> | number
    endTime?: FloatFilter<"TranscriptSegment"> | number
    text?: StringFilter<"TranscriptSegment"> | string
    confidence?: FloatNullableFilter<"TranscriptSegment"> | number | null
  }

  export type TranscriptCreateWithoutSegmentsInput = {
    id?: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    meeting: MeetingCreateNestedOneWithoutTranscriptInput
  }

  export type TranscriptUncheckedCreateWithoutSegmentsInput = {
    id?: string
    meetingId: string
    fullText: string
    language?: string
    source?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TranscriptCreateOrConnectWithoutSegmentsInput = {
    where: TranscriptWhereUniqueInput
    create: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
  }

  export type TranscriptUpsertWithoutSegmentsInput = {
    update: XOR<TranscriptUpdateWithoutSegmentsInput, TranscriptUncheckedUpdateWithoutSegmentsInput>
    create: XOR<TranscriptCreateWithoutSegmentsInput, TranscriptUncheckedCreateWithoutSegmentsInput>
    where?: TranscriptWhereInput
  }

  export type TranscriptUpdateToOneWithWhereWithoutSegmentsInput = {
    where?: TranscriptWhereInput
    data: XOR<TranscriptUpdateWithoutSegmentsInput, TranscriptUncheckedUpdateWithoutSegmentsInput>
  }

  export type TranscriptUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutTranscriptNestedInput
  }

  export type TranscriptUncheckedUpdateWithoutSegmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    fullText?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingCreateWithoutMomInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutMomInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutMomInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutMomInput, MeetingUncheckedCreateWithoutMomInput>
  }

  export type MeetingUpsertWithoutMomInput = {
    update: XOR<MeetingUpdateWithoutMomInput, MeetingUncheckedUpdateWithoutMomInput>
    create: XOR<MeetingCreateWithoutMomInput, MeetingUncheckedCreateWithoutMomInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutMomInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutMomInput, MeetingUncheckedUpdateWithoutMomInput>
  }

  export type MeetingUpdateWithoutMomInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutMomInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutActionItemsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutActionItemsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutActionItemsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutActionItemsInput, MeetingUncheckedCreateWithoutActionItemsInput>
  }

  export type UserCreateWithoutOwnedTasksInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOwnedTasksInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingUncheckedCreateNestedManyWithoutOrganizerInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOwnedTasksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
  }

  export type MeetingUpsertWithoutActionItemsInput = {
    update: XOR<MeetingUpdateWithoutActionItemsInput, MeetingUncheckedUpdateWithoutActionItemsInput>
    create: XOR<MeetingCreateWithoutActionItemsInput, MeetingUncheckedCreateWithoutActionItemsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutActionItemsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutActionItemsInput, MeetingUncheckedUpdateWithoutActionItemsInput>
  }

  export type MeetingUpdateWithoutActionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutActionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type UserUpsertWithoutOwnedTasksInput = {
    update: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
    create: XOR<UserCreateWithoutOwnedTasksInput, UserUncheckedCreateWithoutOwnedTasksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutOwnedTasksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutOwnedTasksInput, UserUncheckedUpdateWithoutOwnedTasksInput>
  }

  export type UserUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOwnedTasksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUncheckedUpdateManyWithoutOrganizerNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MeetingCreateWithoutDecisionsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutDecisionsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutDecisionsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutDecisionsInput, MeetingUncheckedCreateWithoutDecisionsInput>
  }

  export type MeetingUpsertWithoutDecisionsInput = {
    update: XOR<MeetingUpdateWithoutDecisionsInput, MeetingUncheckedUpdateWithoutDecisionsInput>
    create: XOR<MeetingCreateWithoutDecisionsInput, MeetingUncheckedCreateWithoutDecisionsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutDecisionsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutDecisionsInput, MeetingUncheckedUpdateWithoutDecisionsInput>
  }

  export type MeetingUpdateWithoutDecisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutDecisionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutSummaryInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    auditLogs?: AuditLogCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutSummaryInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutSummaryInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
  }

  export type MeetingUpsertWithoutSummaryInput = {
    update: XOR<MeetingUpdateWithoutSummaryInput, MeetingUncheckedUpdateWithoutSummaryInput>
    create: XOR<MeetingCreateWithoutSummaryInput, MeetingUncheckedCreateWithoutSummaryInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutSummaryInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutSummaryInput, MeetingUncheckedUpdateWithoutSummaryInput>
  }

  export type MeetingUpdateWithoutSummaryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutSummaryInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingCreateWithoutAuditLogsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    organizer?: UserCreateNestedOneWithoutOrganizedMeetingsInput
    participants?: MeetingParticipantCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptCreateNestedOneWithoutMeetingInput
    mom?: MomCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemCreateNestedManyWithoutMeetingInput
    decisions?: DecisionCreateNestedManyWithoutMeetingInput
    summary?: SummaryCreateNestedOneWithoutMeetingInput
    invites?: MeetingInviteCreateNestedManyWithoutMeetingInput
  }

  export type MeetingUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    organizerId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    participants?: MeetingParticipantUncheckedCreateNestedManyWithoutMeetingInput
    audioFiles?: AudioFileUncheckedCreateNestedManyWithoutMeetingInput
    transcript?: TranscriptUncheckedCreateNestedOneWithoutMeetingInput
    mom?: MomUncheckedCreateNestedOneWithoutMeetingInput
    actionItems?: ActionItemUncheckedCreateNestedManyWithoutMeetingInput
    decisions?: DecisionUncheckedCreateNestedManyWithoutMeetingInput
    summary?: SummaryUncheckedCreateNestedOneWithoutMeetingInput
    invites?: MeetingInviteUncheckedCreateNestedManyWithoutMeetingInput
  }

  export type MeetingCreateOrConnectWithoutAuditLogsInput = {
    where: MeetingWhereUniqueInput
    create: XOR<MeetingCreateWithoutAuditLogsInput, MeetingUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingCreateNestedManyWithoutOrganizerInput
    ownedTasks?: ActionItemCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    email: string
    name: string
    createdAt?: Date | string
    updatedAt?: Date | string
    organizedMeetings?: MeetingUncheckedCreateNestedManyWithoutOrganizerInput
    ownedTasks?: ActionItemUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type MeetingUpsertWithoutAuditLogsInput = {
    update: XOR<MeetingUpdateWithoutAuditLogsInput, MeetingUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<MeetingCreateWithoutAuditLogsInput, MeetingUncheckedCreateWithoutAuditLogsInput>
    where?: MeetingWhereInput
  }

  export type MeetingUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: MeetingWhereInput
    data: XOR<MeetingUpdateWithoutAuditLogsInput, MeetingUncheckedUpdateWithoutAuditLogsInput>
  }

  export type MeetingUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizer?: UserUpdateOneWithoutOrganizedMeetingsNestedInput
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    organizerId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUpdateManyWithoutOrganizerNestedInput
    ownedTasks?: ActionItemUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organizedMeetings?: MeetingUncheckedUpdateManyWithoutOrganizerNestedInput
    ownedTasks?: ActionItemUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type MeetingCreateManyOrganizerInput = {
    id?: string
    title: string
    description?: string
    scheduledAt: Date | string
    durationMinutes?: number
    status?: $Enums.MeetingStatus
    tag?: $Enums.MeetingTag
    notes?: string
    calendarEventId?: string | null
    recordingUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ActionItemCreateManyOwnerInput = {
    id?: string
    meetingId: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogCreateManyUserInput = {
    id?: string
    meetingId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MeetingUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUpdateOneWithoutMeetingNestedInput
    mom?: MomUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: MeetingParticipantUncheckedUpdateManyWithoutMeetingNestedInput
    audioFiles?: AudioFileUncheckedUpdateManyWithoutMeetingNestedInput
    transcript?: TranscriptUncheckedUpdateOneWithoutMeetingNestedInput
    mom?: MomUncheckedUpdateOneWithoutMeetingNestedInput
    actionItems?: ActionItemUncheckedUpdateManyWithoutMeetingNestedInput
    decisions?: DecisionUncheckedUpdateManyWithoutMeetingNestedInput
    summary?: SummaryUncheckedUpdateOneWithoutMeetingNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutMeetingNestedInput
    invites?: MeetingInviteUncheckedUpdateManyWithoutMeetingNestedInput
  }

  export type MeetingUncheckedUpdateManyWithoutOrganizerInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    scheduledAt?: DateTimeFieldUpdateOperationsInput | Date | string
    durationMinutes?: IntFieldUpdateOperationsInput | number
    status?: EnumMeetingStatusFieldUpdateOperationsInput | $Enums.MeetingStatus
    tag?: EnumMeetingTagFieldUpdateOperationsInput | $Enums.MeetingTag
    notes?: StringFieldUpdateOperationsInput | string
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    recordingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneRequiredWithoutActionItemsNestedInput
  }

  export type ActionItemUncheckedUpdateWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUncheckedUpdateManyWithoutOwnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meeting?: MeetingUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meetingId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingParticipantCreateManyMeetingInput = {
    id?: string
    name: string
    email: string
    role?: string | null
  }

  export type AudioFileCreateManyMeetingInput = {
    id?: string
    storageKey: string
    mimeType: string
    sizeBytes: number
    createdAt?: Date | string
  }

  export type ActionItemCreateManyMeetingInput = {
    id?: string
    description: string
    ownerName?: string | null
    ownerEmail?: string | null
    ownerId?: string | null
    dueDate?: Date | string | null
    priority?: $Enums.TaskPriority
    status?: $Enums.TaskStatus
    confidence?: number | null
    externalId?: string | null
    externalUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DecisionCreateManyMeetingInput = {
    id?: string
    text: string
    timestamp?: number | null
    createdAt?: Date | string
  }

  export type AuditLogCreateManyMeetingInput = {
    id?: string
    userId?: string | null
    action: $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type MeetingInviteCreateManyMeetingInput = {
    id?: string
    email: string
    name: string
    status: $Enums.InviteStatus
    error?: string | null
    sentAt?: Date | string
  }

  export type MeetingParticipantUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MeetingParticipantUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MeetingParticipantUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    role?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AudioFileUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudioFileUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AudioFileUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    storageKey?: StringFieldUpdateOperationsInput | string
    mimeType?: StringFieldUpdateOperationsInput | string
    sizeBytes?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneWithoutOwnedTasksNestedInput
  }

  export type ActionItemUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ActionItemUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    ownerName?: NullableStringFieldUpdateOperationsInput | string | null
    ownerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    ownerId?: NullableStringFieldUpdateOperationsInput | string | null
    dueDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    priority?: EnumTaskPriorityFieldUpdateOperationsInput | $Enums.TaskPriority
    status?: EnumTaskStatusFieldUpdateOperationsInput | $Enums.TaskStatus
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    externalId?: NullableStringFieldUpdateOperationsInput | string | null
    externalUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DecisionUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    action?: EnumPipelineStepFieldUpdateOperationsInput | $Enums.PipelineStep
    details?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteUncheckedUpdateWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeetingInviteUncheckedUpdateManyWithoutMeetingInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    status?: EnumInviteStatusFieldUpdateOperationsInput | $Enums.InviteStatus
    error?: NullableStringFieldUpdateOperationsInput | string | null
    sentAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptSegmentCreateManyTranscriptInput = {
    id?: string
    speaker: string
    startTime: number
    endTime: number
    text: string
    confidence?: number | null
  }

  export type TranscriptSegmentUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptSegmentUncheckedUpdateWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptSegmentUncheckedUpdateManyWithoutTranscriptInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    startTime?: FloatFieldUpdateOperationsInput | number
    endTime?: FloatFieldUpdateOperationsInput | number
    text?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
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