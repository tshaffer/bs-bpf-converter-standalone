import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import {
  fixJson,
  getParameterArray,
  stringToJson
} from './helpers';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

import {
  fixInteractiveZonePlaylist,
  fixTickerZonePlaylistStates,
  fixZonePlaylistStates,
} from './bpfStatesToJson';

import {
  fixBackgroundScreenColor,
} from './bpfPresentationPropertiesToJson';

// LOOKS OK
export function fixZones(rawZoneSpecs: any) : any {
  let zones : any = [];

  if (isObject(rawZoneSpecs[0].zone)) {
    const rawZones: any[] = getParameterArray(rawZoneSpecs[0].zone);
    zones = rawZones.map( (rawZoneSpec: any) => {
      return fixZone(rawZoneSpec);
    });
}
  return zones;
}

// LOOKS OK
function fixZone(rawZone : any) : any {

  const zone: any = fixZoneParametersCommon(rawZone);
  switch (zone.type) {
    case 'VideoOrImages': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersVideoOrImages(rawZone.zoneSpecificParameters);
      break;
    }
    case 'VideoOnly': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersVideoOnly(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Images': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersImages(rawZone.zoneSpecificParameters);
      break;
    }
    case 'AudioOnly': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersAudioOnly(rawZone.zoneSpecificParameters);
      break;
    }
    case 'EnhancedAudio': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersEnhancedAudio(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Clock': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersClock(rawZone.zoneSpecificParameters);
      break;
    }
    case 'BackgroundImage': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersBackgroundImage(rawZone.zoneSpecificParameters);
      break;
    }
    case 'Ticker': {
      zone.zoneSpecificParameters = fixZoneSpecificParametersTicker(rawZone.zoneSpecificParameters);
      break;
    }
    default: {
      // TODO - throw error
      debugger;
      break;
    }
  }
  zone.playlist = fixZonePlaylist(zone.type, rawZone.playlist);
  return zone;
}

// LOOKS OK
function fixZoneParametersCommon(rawZone : any) : any {

  const zoneParametersSpec: any[] = [
    { name: 'height', type: 'number'},
    { name: 'horizontalOffset', type: 'number'},
    { name: 'id', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'type', type: 'string'},
    { name: 'verticalOffset', type: 'number'},
    { name: 'width', type: 'number'},
    { name: 'x', type: 'number'},
    { name: 'y', type: 'number'},
    { name: 'zoomValue', type: 'number'},
  ];

  return fixJson(zoneParametersSpec, rawZone);
}

// TODO - implement
function fixZoneSpecificParametersImages(rawZoneSpecificParameters : any) : any {
  return null;
}

// TODO - implement
function fixZoneSpecificParametersAudioOnly(rawZoneSpecificParameters : any) : any {
  return null;
}

// TODO - implement
function fixZoneSpecificParametersEnhancedAudio(rawZoneSpecificParameters : any) : any {
  return null;
}

// TODO - implement
function fixZoneSpecificParametersClock(rawZoneSpecificParameters : any) : any {
  return null;
}

// TODO - implement
function fixZoneSpecificParametersBackgroundImage(rawZoneSpecificParameters : any) : any {
  return null;
}

// LOOKS OK
function fixZoneSpecificParametersTicker(rawZoneSpecificParameters : any) : any {
  const zoneSpecificParametersSpec: any[] = [
    { name: 'scrollSpeed', type: 'number'}
  ];

  const zoneSpecificParameters : any = fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);

  zoneSpecificParameters.textWidget = fixTextWidget(rawZoneSpecificParameters.textWidget);
  zoneSpecificParameters.widget = fixWidget(rawZoneSpecificParameters.widget);

  return zoneSpecificParameters;
}

// LOOKS OK
function fixTextWidget(rawTextWidgetParams : any) : any {
  const textWidgetParametersSpec: any[] = [
    { name: 'numberOfLines', type: 'number'},
    { name: 'delay', type: 'number'},
    { name: 'rotation', type: 'number'},
    { name: 'alignment', type: 'string'},
    { name: 'scrollingMethod', type: 'number'},
  ];

  return fixJson(textWidgetParametersSpec, rawTextWidgetParams);
}

// TODO - TEST
function fixWidget(rawWidgetParams : any) : any {
  const widgetParametersSpec: any[] = [
    { name: 'font', type: 'string'},
    { name: 'fontSize', type: 'number'},
  ];

  const widgetParams : any = fixJson(widgetParametersSpec, rawWidgetParams);
  if (!isNil(rawWidgetParams.backgroundBitmap) && !isNil(rawWidgetParams.backgroundBitmap.$)) {
    const backgroundBitmap: any = fixRawBackgroundBitmap(rawWidgetParams.backgroundBitmap.$);
    widgetParams.backgroundBitmap = backgroundBitmap.file;
    widgetParams.stretchBitmapFile = backgroundBitmap.stretch;
  }
  else {
    widgetParams.backgroundBitmap = '';
    widgetParams.stretchBitmapFile = 0;
  }

  widgetParams.foregroundTextColor = fixBackgroundScreenColor(rawWidgetParams.foregroundTextColor);
  widgetParams.backgroundTextColor = fixBackgroundScreenColor(rawWidgetParams.backgroundTextColor);
  widgetParams.safeTextRegion = null;

  return widgetParams;
}

// TODO - much to implement
function getAudioZoneSpecificParametersSpec() : any {

  // TODO
  // Don't see audioMixMode in sample presentation for XT1143
  /* missing parameters
   <usbOutputTypeA>None</usbOutputTypeA>
   <usbOutputTypeC>None</usbOutputTypeC>
   <usbOutput700_1>None</usbOutput700_1>
   <usbOutput700_2>None</usbOutput700_2>
   <usbOutput700_3>None</usbOutput700_3>
   <usbOutput700_4>None</usbOutput700_4>
   <usbOutput700_5>None</usbOutput700_5>
   <usbOutput700_6>None</usbOutput700_6>
   <usbOutput700_7>None</usbOutput700_7>
   */
  const audioZoneSpecificParametersSpec: any[] = [
    { name: 'analogOutput', type: 'string'},
    {name: 'analog2Output', type: 'string'},
    {name: 'analog3Output', type: 'string'},
    {name: 'audioMapping', type: 'string'},
    {name: 'audioMixMode', type: 'string'},
    {name: 'audioMode', type: 'string'},
    {name: 'audioOutput', type: 'string'},
    {name: 'audioVolume', type: 'number'},
    { name: 'hdmiOutput', type: 'string'},
    { name: 'spdifOutput', type: 'string'},
    { name: 'usbOutput', type: 'string'},
    { name: 'usbOutputA', type: 'string'},
    { name: 'usbOutputB', type: 'string'},
    { name: 'usbOutputC', type: 'string'},
    { name: 'usbOutputD', type: 'string'},
  ];

  return audioZoneSpecificParametersSpec;
}

// LOOKS OK
function getVideoZoneSpecificParametersSpec() : any {

  const audioZoneSpecificParametersSpec = getAudioZoneSpecificParametersSpec();

  let videoZoneSpecificParametersSpec: any[] = [
    { name: 'brightness', type: 'number'},
    { name: 'contrast', type: 'number'},
    { name: 'hue', type: 'number'},
    { name: 'liveVideoInput', type: 'string'},
    { name: 'liveVideoStandard', type: 'string'},
    { name: 'maxContentResolution', type: 'string'},
    { name: 'maximumVolume', type: 'number'},
    { name: 'minimumVolume', type: 'number'},
    { name: 'mosaic', type: 'boolean'},
    { name: 'saturation', type: 'number'},
    { name: 'videoVolume', type: 'number'},
    { name: 'viewMode', type: 'string'},
    { name: 'zOrderFront', type: 'boolean'},
  ];

  videoZoneSpecificParametersSpec = videoZoneSpecificParametersSpec.concat(audioZoneSpecificParametersSpec);

  return videoZoneSpecificParametersSpec;
}

// LOOKS OK
function getImageZoneSpecificParametersSpec() : any {
  const imageZoneSpecificParametersSpec: any[] = [
    { name: 'imageMode', type: 'string'},
  ];

  return imageZoneSpecificParametersSpec;
}

// LOOKS OK
function getVideoOrImageZoneSpecificParametersSpec(): any[] {

  const imageZoneSpecificParametersSpec: any = getImageZoneSpecificParametersSpec();
  const videoZoneSpecificParametersSpec: any = getVideoZoneSpecificParametersSpec();
  const videoOrImageZoneSpecificParametersSpec : any[] =
    imageZoneSpecificParametersSpec.concat(videoZoneSpecificParametersSpec);
  return videoOrImageZoneSpecificParametersSpec;
}

// LOOKS OK
function fixZoneSpecificParametersVideoOnly(rawZoneSpecificParameters : any) : any {
  const zoneSpecificParametersSpec: any[] = getVideoZoneSpecificParametersSpec();
  return fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);
}

// LOOKS OK
function fixZoneSpecificParametersVideoOrImages(rawZoneSpecificParameters : any) : any {
  const zoneSpecificParametersSpec: any[] = getVideoOrImageZoneSpecificParametersSpec();
  return fixJson(zoneSpecificParametersSpec, rawZoneSpecificParameters);
}

// LOOKS OK, but
// consider breaking out code for interactive and non interactive into separate functions
function fixZonePlaylist(zoneType : string, rawZonePlaylist : any) : any {
  const playlistParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'type', type: 'string'},
  ];

  const zonePlaylist : any = fixJson(playlistParametersSpec, rawZonePlaylist);

  if (zonePlaylist.type === 'interactive') {
    const interactiveZonePlaylist: any =  fixInteractiveZonePlaylist(rawZonePlaylist);
    zonePlaylist.states = interactiveZonePlaylist.states;
    zonePlaylist.transitions = interactiveZonePlaylist.transitions;
    zonePlaylist.initialState = interactiveZonePlaylist.initialState;
    console.log(zonePlaylist);
  }
  else {
    if (isNil(rawZonePlaylist)) {
      zonePlaylist.states = [];
    }
    else {
      switch (zoneType) {
        case 'VideoOrImages': {
          zonePlaylist.states = fixVideoOrImagesZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'VideoOnly': {
          zonePlaylist.states = fixVideoOnlyZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'Images': {
          zonePlaylist.states = fixImagesZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'AudioOnly': {
          zonePlaylist.states = fixAudioOnlyZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'EnhancedAudio': {
          zonePlaylist.states = fixEnhancedAudioZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'Clock': {
          zonePlaylist.states = fixClockZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'BackgroundImage': {
          zonePlaylist.states = fixBackgroundImageZonePlaylist(rawZonePlaylist);
          break;
        }
        case 'Ticker': {
          zonePlaylist.states = fixTickerZonePlaylist(rawZonePlaylist);
          break;
        }
        default: {
          // throw error
          debugger;
        }
      }
    }
  }

  return zonePlaylist;
}

  // TODO
function fixClockZonePlaylist(rawClockZonePlaylist : any) : any {
  return null;
}

  // TODO
  function fixBackgroundImageZonePlaylist(rawBackgroundImageZonePlaylist : any) : any {
  return null;
}

// TODO - TEST AND CHECK CAREFULLY
function fixTickerZonePlaylist(rawTickerZonePlaylist : any) : any {
  return fixTickerZonePlaylistStates(rawTickerZonePlaylist.$$);
}

// TODO
// is it necessary to have all of these different fix<xx>ZonePlaylist functions to fix the different zone types?
function fixVideoOrImagesZonePlaylist(rawZonePlaylist : any) : any {
  // TODO - check me
  if (rawZonePlaylist.type === 'non-interactive') {
    return fixZonePlaylistStates(rawZonePlaylist.$$);
  }
  else {
    debugger;
  }
}

// LOOKS OK
function fixVideoOnlyZonePlaylist(rawVideoOnlyZonePlaylist : any) : any {
  return fixZonePlaylistStates(rawVideoOnlyZonePlaylist.$$);
}

// LOOKS OK
function fixImagesZonePlaylist(rawImagesZonePlaylist : any) : any {
  return fixZonePlaylistStates(rawImagesZonePlaylist.$$);
}

// LOOKS OK
function fixAudioOnlyZonePlaylist(rawAudioOnlyZonePlaylist : any) : any {
  return fixZonePlaylistStates(rawAudioOnlyZonePlaylist.$$);
}

// LOOKS OK
function fixEnhancedAudioZonePlaylist(rawEnhancedAudioZonePlaylist : any) : any {
  return fixZonePlaylistStates(rawEnhancedAudioZonePlaylist.$$);
}

// TODO - should this be in another file?
function fixRawBackgroundBitmap(rawBackgroundBitmap: any): any {
  const backgroundBitmapParametersSpec: any[] = [
    { name: 'file', type: 'string'},
    { name: 'stretch', type: 'boolean'},
  ];

  return fixJson(backgroundBitmapParametersSpec, rawBackgroundBitmap);
}

