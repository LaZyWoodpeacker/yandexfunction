export namespace YaBot {
  export interface IResponse {
    statusCode: number;
    headers?: { [id: string]: string };
    body: any;
    isBase64Encoded: boolean;
  }
  export interface FunctionsHttpEvent {
    event_metadata?: {
      event_id: string;
      event_type: string;
      created_at: string;
      cloud_id: string;
      folder_id: string;
    };
    httpMethod: string;
    // словарь строк, содержащий HTTP-заголовки запроса и их значения.
    // Если один и тот же заголовок передан несколько раз, словарь содержит последнее переданное значение.
    headers?: { [id: string]: string };
    path?: string;
    // словарь, содержащий HTTP-заголовки запроса и списки с их значениями.
    // Он содержит те же самые ключи, что и словарь headers, но если какой-либо заголовок повторялся несколько раз,
    // список для него будет содержать все переданные значения для данного заголовка.
    // Если заголовок был передан всего один раз, он включается в этот словарь, и список для него будет содержать одно значение.
    multiValueHeaders?: { [id: string]: string[] };
    // словарь, содержащий параметры запроса. Если один и тот же параметр указан несколько раз, словарь содержит последнее указанное значение.
    queryStringParameters?: { [id: string]: string };
    multiValueQueryStringParameters?: { [id: string]: string[] };
    requestContext?: {
      //  <словарь с контекстом запроса>,
      // <набор пар ключ:значение для аутентификации пользователя>
      identity: {
        sourceIp: string; // <адрес, с которого был сделан запрос>
        userAgent: string; // <содержимое HTTP-заголовка User-Agent исходного запроса>
      };
      // "<DELETE, GET, HEAD, OPTIONS, PATCH, POST или PUT>"
      httpMethod: string;
      // <ID запроса, генерируется в роутере>
      requestId: string;
      // <время запроса в формате CLF
      requestTime: string;
      // <время запроса в формате Unix>
      requestTimeEpoch: number;
      authorizer?: any; // "<словарь с контекстом авторизации>",
      apiGateway?: // "<словарь со специфичными данными, передаваемыми API-шлюзом при вызове функции>"
      {
        operationContext: any; // "<словарь с контекстом операции, описанным в спецификации API-шлюза>"
      };
    };
    // одержимое запроса в виде строки. Данные могут быть закодированы в формат Base64 (в этом случае Cloud Functions установит параметр isBase64Encoded: true).
    // Примечание
    // Если функция вызывается с заголовком Content-Type: application/json, то содержимое body останется в исходном формате (значение параметра isBase64Encoded: false).
    body?: string;
    isBase64Encoded?: boolean;
  }

  export interface FunctionsHttpContext {
    // идентификатор запроса к функции, генерируется при обращении к функции и отображается в журнале вызова функции.
    requestId: any;
    functionName: any; // "<идентификатор функции>",
    functionVersion: any; // "<идентификатор версии функции>",
    memoryLimitInMB: any; // "<объем памяти версии функции, МБ>",
    // IAM-токен сервисного аккаунта, указанного для версии функции.
    // Актуальное значение генерируется автоматически.
    // Используется для работы с API Yandex Cloud. Поле присутствует, только если для версии функции указан корректный сервисный аккаунт.
    token?: any; // "<опционально, IAM-токен>",
    getRemainingTimeInMillis: () => number; // возвращает время, оставшееся на выполнение текущего запроса в миллисекундах;
    getPayload: () => string; // возвращает тело запроса, если используется HTTP-интеграция. По умолчанию HTTP-интеграция используется для всех вызовов функции, если не указан параметр integration=raw
  }
}

interface IClone {
  timestamp: string;
  count: number;
  uniques: number;
}

interface IClones {
  count: number;
  uniques: number;
  clones: IClone[];
}

interface IConfig {
  id: string;
  chatid: string;
  clones: IClones[];
  hash: string;
  project: string;
}
