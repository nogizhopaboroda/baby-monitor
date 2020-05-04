export const HOST = process.env.HOST || self.location.hostname;

export const RAW_AUDIO_SAMPLE_RATE = process.env.RAW_AUDIO_SAMPLE_RATE || 8000;
export const AUDIO_CHANNELS = process.env.AUDIO_CHANNELS || 1;

export const AUDIO_STREAMER_WS_PORT =
  process.env.AUDIO_STREAMER_WS_PORT || 8000;
export const RAW_AUDIO_STREAMER_WS_PORT =
  process.env.RAW_AUDIO_STREAMER_WS_PORT || 8001;

export const VIDEO_HEIGHT = process.env.VIDEO_HEIGHT || 640;
export const VIDEO_WIDTH = process.env.VIDEO_WIDTH || 480;

export const VIDEO_STREAMER_WS_PORT = process.env.VIDEO_STREAMER_WS_PORT || 9000;
export const RAW_VIDEO_STREAMER_WS_PORT =
  process.env.RAW_VIDEO_STREAMER_WS_PORT || 9001;

export const TEMP_HUMIDITY_STREAMER_WS_PORT =
    process.env.TEMP_HUMIDITY_STREAMER_WS_PORT || 7000;
