import Foundation

public enum ANIMAChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(ANIMAChatEventPayload)
    case agent(ANIMAAgentEventPayload)
    case seqGap
}

public protocol ANIMAChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> ANIMAChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [ANIMAChatAttachmentPayload]) async throws -> ANIMAChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> ANIMAChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<ANIMAChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension ANIMAChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "ANIMAChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> ANIMAChatSessionsListResponse {
        throw NSError(
            domain: "ANIMAChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
