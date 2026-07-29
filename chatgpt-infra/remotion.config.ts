/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
/**
 * Three self-hosted fonts are loaded through delayRender(). A single still
 * clears them in well under a second, but several render tabs contending for
 * CPU can blow past the 28 s default — which fails the whole render at frame 0.
 */
Config.setDelayRenderTimeoutInMilliseconds(180000);
Config.overrideWebpackConfig(enableTailwind);
