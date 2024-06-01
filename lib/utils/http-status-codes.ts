export interface HttpStatusCode {
  status: number
  statusText: string
  message: string
}

// prettier-ignore
export const httpStatusCodes: HttpStatusCode[] = [
  { status: 100, statusText: "Continue", message: "This interim response indicates that the client should continue the request or ignore the response if the request is already finished." },
  { status: 101, statusText: "Switching Protocols", message: "This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to." },
  { status: 102, statusText: "Processing", message: "This code indicates that the server has received and is processing the request, but no response is available yet." },
  { status: 103, statusText: "Early Hints", message: "" },

  { status: 200, statusText: "OK", message: "The request succeeded." },
  { status: 201, statusText: "Created", message: "The request succeeded, and a new resource was created as a result." },
  { status: 202, statusText: "Accepted", message: "The request has been received but not yet acted upon." },
  { status: 203, statusText: "Non-Authoritative Information", message: "This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy." },
  { status: 204, statusText: "No Content", message: "There is no content to send for this request, but the headers may be useful." },
  { status: 205, statusText: "Reset Content", message: "Tells the user agent to reset the document which sent this request." },
  { status: 206, statusText: "Partial Content", message: "This response code is used when the Range header is sent from the client to request only part of a resource." },
  { status: 207, statusText: "Multi-Status", message: "Conveys information about multiple resources, for situations where multiple status codes might be appropriate." },
  { status: 208, statusText: "Already Reported", message: "Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection." },
  { status: 226, statusText: "IM Used", message: "The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance." },

  { status: 300, statusText: "Multiple Choices", message: "The request has more than one possible response." },
  { status: 301, statusText: "Moved Permanently", message: "The URL of the requested resource has been changed permanently." },
  { status: 302, statusText: "Found", message: "This response code means that the URI of requested resource has been changed temporarily." },
  { status: 303, statusText: "See Other", message: "The server sent this response to direct the client to get the requested resource at another URI with a GET request." },
  { status: 304, statusText: "Not Modified", message: "This is used for caching purposes." },
  { status: 305, statusText: "Use Proxy", message: "Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy." },
  { status: 306, statusText: "Switch Proxy", message: "(Unused) This response code is no longer used; it is just reserved." },
  { status: 307, statusText: "Temporary Redirect", message: "The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request." },
  { status: 308, statusText: "Permanent Redirect", message: "This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header." },

  { status: 400, statusText: "Bad Request", message: "The server cannot or will not process the request due to something that is perceived to be a client error." },
  { status: 401, statusText: "Unauthorized", message: "The client must authenticate itself to get the requested response." },
  { status: 402, statusText: "Payment Required", message: "(Unused) This response code is reserved for future use." },
  { status: 403, statusText: "Forbidden", message: "The client does not have access rights to the content." },
  { status: 404, statusText: "Not Found", message: "The server cannot find the requested resource." },
  { status: 405, statusText: "Method Not Allowed", message: "The request method is known by the server but is not supported by the target resource." },
  { status: 406, statusText: "Not Acceptable", message: "This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent." },
  { status: 407, statusText: "Proxy Authentication Required", message: "This is similar to 401 Unauthorized but authentication is needed to be done by a proxy." },
  { status: 408, statusText: "Request Timeout", message: "This response is sent on an idle connection by some servers, even without any previous request by the client." },
  { status: 409, statusText: "Conflict", message: "This response is sent when a request conflicts with the current state of the server." },
  { status: 410, statusText: "Gone", message: "This response is sent when the requested content has been permanently deleted from server, with no forwarding address." },
  { status: 411, statusText: "Length Required", message: "Server rejected the request because the Content-Length header field is not defined and the server requires it." },
  { status: 412, statusText: "Precondition Failed", message: "The client has indicated preconditions in its headers which the server does not meet." },
  { status: 413, statusText: "Payload Too Large", message: "Request entity is larger than limits defined by server." },
  { status: 414, statusText: "URI Too Long", message: "The URI requested by the client is longer than the server is willing to interpret." },
  { status: 415, statusText: "Unsupported Media Type", message: "The media format of the requested data is not supported by the server, so the server is rejecting the request." },
  { status: 416, statusText: "Range Not Satisfiable", message: "The range specified by the Range header field in the request cannot be fulfilled." },
  { status: 417, statusText: "Expectation Failed", message: "This response code means the expectation indicated by the Expect request header field cannot be met by the server." },
  { status: 418, statusText: "I'm a teapot", message: "(Unused) The server refuses the attempt to brew coffee with a teapot." },
  { status: 421, statusText: "Misdirected Request", message: "The request was directed at a server that is not able to produce a response." },
  { status: 422, statusText: "Unprocessable Content", message: "The request was well-formed but was unable to be followed due to semantic errors." },
  { status: 423, statusText: "Locked", message: "The resource that is being accessed is locked." },
  { status: 424, statusText: "Failed Dependency", message: "The request failed due to failure of a previous request." },
  { status: 425, statusText: "Too Early", message: "Indicates that the server is unwilling to risk processing a request that might be replayed." },
  { status: 426, statusText: "Upgrade Required", message: "The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol." },
  { status: 428, statusText: "Precondition Required", message: "The origin server requires the request to be conditional." },
  { status: 429, statusText: "Too Many Requests", message: "The user has sent too many requests in a given amount of time." },
  { status: 431, statusText: "Request Header Fields Too Large", message: "The server is unwilling to process the request because its header fields are too large." },
  { status: 451, statusText: "Unavailable For Legal Reasons", message: "The user agent requested a resource that cannot legally be provided, such as a web page censored by a government." },

  { status: 500, statusText: "Internal Server Error", message: "The server has encountered a situation it does not know how to handle." },
  { status: 501, statusText: "Not Implemented", message: "The request method is not supported by the server and cannot be handled." },
  { status: 502, statusText: "Bad Gateway", message: "This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response." },
  { status: 503, statusText: "Service Unavailable", message: "The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded." },
  { status: 504, statusText: "Gateway Timeout", message: "This error response is given when the server is acting as a gateway and cannot get a response in time." },
  { status: 505, statusText: "HTTP Version Not Supported", message: "The HTTP version used in the request is not supported by the server." },
  { status: 506, statusText: "Variant Also Negotiates", message: "The server has an internal configuration error." },
  { status: 507, statusText: "Insufficient Storage", message: "The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request." },
  { status: 508, statusText: "Loop Detected", message: "The server detected an infinite loop while processing the request." },
  { status: 510, statusText: "Not Extended", message: "Further extensions to the request are required for the server to fulfill it." },
  { status: 511, statusText: "Network Authentication Required", message: "Indicates that the client needs to authenticate to gain network access." }
]

export const httpUnknownStatusCode: HttpStatusCode = {
  status: 520,
  statusText: 'Unknown error',
  message: 'Web server is returning an unknown error.',
}

export function httpStatusCode(status: number): HttpStatusCode {
  return (
    httpStatusCodes.find((v: HttpStatusCode) => v.status === status) ??
    httpUnknownStatusCode
  )
}

export function httpStatusText(status: number): string {
  return (
    httpStatusCodes.find((v: HttpStatusCode) => v.status === status)
      ?.statusText ?? httpUnknownStatusCode?.statusText
  )
}

export function httpStatusMessage(status: number): string {
  return (
    httpStatusCodes.find((v: HttpStatusCode) => v.status === status)?.message ??
    httpUnknownStatusCode?.message
  )
}
