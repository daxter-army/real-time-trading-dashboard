import type { CHART_TYPES, HISTORY_PERIOD, WEBSOCKET_EVENTS } from "@/constants/constants";

export type CHART_TYPE = typeof CHART_TYPES[keyof typeof CHART_TYPES]
export type HISTORY_PERIOD_TYPE = typeof HISTORY_PERIOD[keyof typeof HISTORY_PERIOD]
export type WEBSOCKET_EVENT_TYPE = typeof WEBSOCKET_EVENTS[keyof typeof WEBSOCKET_EVENTS]
