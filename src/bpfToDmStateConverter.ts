import { bsnGetSession } from '@brightsign/bsnconnector';
import path from 'isomorphic-path';

import { cloneDeep, isNil, isString } from 'lodash';

import {
  getTransitionType,
  getRotation,
} from './converters';

// import {
//   baPeUiModelAddInteractiveCanvasState,
//   baPeUiModelAddInteractiveCanvasEvent,
// } from '@brightsign/ba-presentation-edit-ui';

import {
  TransitionDisplayType,
  TransitionDisplayLabelLocationType,
} from '@brightsign/ba-uw-dm';

import {
  BsnDataFeedAssetType,
  CompareOperator,
  NumberParameterType,
  EventIntrinsicAction,
  BpType,
  BpIndex,
  ButtonDirection,
  RegionDirection,
  DistanceUnits,
  MediaListPlaybackType,

  bscAssetItemFromAssetLocator,
  bscAssetLocatorForLocalAsset,
  BsAssetLocator,

  CommandType,

  bscAssetItemFromBasicAssetInfo,
  getEnumKeyOfValue,
  AccessType,
  AssetLocation,
  AssetType,
  AudioMixModeType,
  BsAssetId,
  BsAssetIdNone,
  BsAssetItem,
  BsColor,
  BsnFeedProperties,
  BsRect,
  CommandSequenceType,
  DataFeedUsageType,
  DeviceWebPageDisplay,
  GraphicsZOrderType,
  EventType,
  HtmlSiteType,
  ImageModeType,
  LanguageType,
  LanguageKeyType,
  LiveVideoInputType,
  LiveVideoStandardType,
  MediaType,
  MonitorOrientationType,
  PlayFileTriggerType,
  RotationType,
  SystemVariableType,
  TextHAlignmentType,
  TextScrollingMethodType,
  TransitionType,
  UdpAddressType,
  VideoConnectorType,
  ZoneType,
  AudioOutputName,
  BpAction,
} from '@brightsign/bscore';

import { fsGetAssetItemFromFile } from '@brightsign/fsconnector';

import {
  dmCreateTransitionCondition,
  DmCondition,
  dmAddConditionalTransition,
  ConditionalTransitionParams,
  dmUpdateMediaState,
  dmCreateEventHandlerContentItem,
  DmEventHandlerContentItem,
  dmCreateEventDataForEventType,
  DmEventSpecification,
  dmCreateDefaultEventSpecificationForEventType,
  dmInteractiveAddTransitionForEventSpecification,
  InteractiveAddEventTransitionAction,
  InteractiveAddEventTransitionParams,
  dmGetMediaStateById,
  dmGetMediaStateByName,
  DmBpEventData,
  DmGpioEventData,
  DmGpsEventData,
  DmPluginMessageEventData,
  DmRectangularTouchEventData,
  DmTimer,
  dmCreateMediaListContentItem,
  MediaListContentItemProperties,
  DmMediaListContentItem,
  dmMediaSequenceAddItemRange,
  MediaStateUpdateParams,
  MediaStateContainerType,
  DmcMediaStateContainer,
  dmGetMediaStateContainer,
  dmMediaListAddGlobalEvent,
  DmcMediaListMediaState,
  CommandAddParams,
  DmCommand,
  dmCreateCommand,
  dmAddCommand,
  CommandDataParams,
  dmCreateSuperStateContentItem,
  DmSuperStateContentItem,

  PlayFileContentItemProperties,

  dmCreatePlayFileContentItem,
  DmPlayFileContentItem,
  dmCreateAssetItemFromLocalFile,
  DmMediaStateSequence,
  dmGetMediaStateSequenceForContainer,

  DmTimeClockEventData,
  DmTimeClockEventType,
  DmTimeClockDateTimeEventData,
  DmTimeClockByUserVariableEventData,
  DmTimeClockDailyOnceEventData,
  DmTimeClockDailyPeriodicEventData,

  AudioSignPropertyMapParams,
  BrightScriptPluginParams,
  BsDmAction,
  BsDmId,
  BsDmThunkAction,

  DmBsnDataFeedSourceSpecification,
  DmRemoteDataFeedSourceSpecification,
  DmDataFeedProperties,
  DataFeedAddParams,

  DmEventData,
  DmcHtmlSite,
  DmcParserBrightScriptPlugin,
  DmcUserVariable,
  DmAudioOutputAssignmentMap,
  DmAudioSignProperties,
  DmAudioSignPropertyMap,
  DmAudioZonePropertyData,
  DmBrightScriptPlugin,
  DmDataFeedContentItem,
  DmHtmlContentItem,
  DmImageZoneProperties,
  DmImageZonePropertyData,
  DmLiveVideoContentItem,
  DmMediaStateContainer,
  DmMrssDataFeedContentItem,
  DmParameterizedNumber,
  DmParameterizedString,
  dmGetDisplayStringFromParameterizedString,
  DmSerialPortConfiguration,
  DmSerialPortList,
  DmSignMetadata,
  DmSignProperties,
  DmSignState,
  DmState,
  DmTextWidget,
  DmTickerZoneProperties,
  DmMjpegStreamContentItem,
  dmCreateMjpegStreamContentItem,
  DmVideoStreamContentItem,
  DmVideoZoneProperties,
  DmVideoZonePropertyData,
  DmWidget,
  DmcDataFeed,
  EventParams,
  HtmlSiteHostedAction,
  HtmlSiteRemoteAction,
  MediaStateAction,
  MediaStateParams,
  ParserBrightScriptPluginParams,
  SignAction,
  TickerZonePropertyParams,
  TransitionAction,
  UserVariableAction,
  VideoOrImagesZonePropertyParams,
  VideoZonePropertyParams,
  ZoneAction,
  ZoneAddAction,
  ZoneAddParams,
  ZonePropertyUpdateAction,
  ZonePropertyUpdateParams,
  dmAddBrightScriptPlugin,
  dmAddEvent,
  dmAddHostedHtmlSite,
  dmAddMediaState,
  dmAddParserBrightScriptPlugin,
  dmAddRemoteHtmlSite,
  dmAddDataFeed,
  // dmAddTransition,
  dmAddUserVariable,
  dmAddZone,
  dmAppendStringToParameterizedString,
  dmAppendUserVariableToParameterizedString,
  dmCreateDataFeedContentItem,
  dmCreateHtmlContentItem,
  dmCreateLiveVideoContentItem,
  dmCreateMrssDataFeedContentItem,
  dmCreateVideoStreamContentItem,
  dmGetDataFeedById,
  dmGetDataFeedByName,
  dmCreateBsnDataFeedSpecification,
  dmGetEmptyParameterizedString,
  dmGetHtmlSiteByName,
  dmGetParserPluginByName,
  dmGetScriptPluginIds,
  dmGetScriptPluginStateById,
  dmGetUserVariableById,
  dmGetUserVariableIdForName,
  dmGetZoneMediaStateContainer,
  dmGetZonePropertiesById,
  dmGetSignState,
  dmNewSign,
  dmUpdateSignAudioPropertyMap,
  dmUpdateSignProperties,
  dmUpdateSignSerialPorts,
  dmUpdateZone,
  dmUpdateZoneProperties, DmZoneSpecificProperties, HtmlSiteHostedParams, DmcMediaState, DmEvent, BsDmIdNone,
  DmSimpleEventData, DmUdpEventData, DmSerialEventData, DmcCondition,
} from '@brightsign/bsdatamodel';

import {
  BsAsset,
  BsAssetCollection,
  cmGetBsAssetCollection
} from '@brightsign/bs-content-manager';

import * as Converters from './converters';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';
import { isObject, isNumber, isArray } from 'util';

// TODO - store this in redux?
const bsnDynamicPlaylistCollection: BsAssetCollection = null;
const bsnTaggedPlaylistCollection: BsAssetCollection = null;
const bsnDataFeedCollection: BsAssetCollection = null;
const bsnMediaFeedCollection: BsAssetCollection = null;

export function generateStateFromBpf(bpf: any): Function {

  return (dispatch: Function, getState: Function): Promise<void> => {
    return new Promise((resolve, reject) => {
      dispatch(newSign(bpf));
      dispatch(setSignProperties(bpf));
      dispatch(setSignAudioProperties(bpf));
      dispatch(setSerialPortConfiguration(bpf));
      // TODO need to add data feeds before adding user variables, or need to make two passes through user variables
      dispatch(addUserVariables(bpf.metadata.userVariables));
      dispatch(addHtmlSites(bpf.metadata.htmlSites));
      dispatch(addScriptPlugins(bpf.metadata.scriptPlugins));
      dispatch(addParserPlugins(bpf.metadata.parserPlugins));
      const addLiveDataFeedsPromise: Promise<void> = dispatch(addLiveDataFeeds(bpf.metadata.liveDataFeeds));

      addLiveDataFeedsPromise.then(() => {
        dispatch(addZones(bpf));
        console.log(getState());
        resolve(getState());
      }).catch((err) => {
        return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'generateDmStateFromBpf: ' + err));
      });
    });
  };
}

// LOOKS OK
function newSign(bpf: any): Function {
  return (dispatch: Function): any => {
    const { name, videoMode, model } = bpf.metadata;
    dispatch(dmNewSign(name, videoMode, model));
  };
}

// TODO - see below
function setSignProperties(bpf: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const state = getState();

    let signAction: SignAction;
    let signState: DmSignState;
    let signMetadata: DmSignMetadata;
    let signProperties: DmSignProperties;

    signState = dmGetSignState(state.bsdm);
    signMetadata = signState.sign;
    signProperties = signMetadata.properties;

    const {
      alphabetizeVariableNames,
      autoCreateMediaCounterVariables,
      delayScheduleChangeUntilMediaEndEvent,
      deviceWebPageDisplay,
      flipCoordinates,
      forceResolution,
      graphicsZOrder,
      htmlEnableJavascriptConsole,
      inactivityTime,
      inactivityTimeout,
      isMosaic,
      language,
      languageKey,
      monitorOrientation,
      monitorOverscan,
      resetVariablesOnPresentationStart,
      tenBitColorEnabled,
      dolbyVision,
      fullResGraphicsEnabled,
      audioConfiguration,
      audioAutoLevel,
      touchCursorDisplayMode,
      udpDestinationAddress,
      udpDestinationAddressType,
      udpDestinationPort,
      udpReceiverPort,
      videoConnector,
    } = bpf.metadata;

    if (!getEnumKeyOfValue(DeviceWebPageDisplay, deviceWebPageDisplay)) {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'DeviceWebPageDisplay: ' + deviceWebPageDisplay);
    }
    if (!getEnumKeyOfValue(GraphicsZOrderType, graphicsZOrder)) {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'GraphicsZOrderType: ' + graphicsZOrder);
    }
    if (!getEnumKeyOfValue(LanguageType, language)) {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'LanguageType: ' + language);
    }
    if (!getEnumKeyOfValue(LanguageKeyType, languageKey)) {
      throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'LanguageKeyType: ' + languageKey);
    }

    // convert monitorOrientation from ba to bacon
    let baconMonitorOrientation: MonitorOrientationType = MonitorOrientationType.Landscape;
    switch (monitorOrientation.toLowerCase()) {
      case 'portraitbottomonright': {
        baconMonitorOrientation = MonitorOrientationType.PortraitBottomRight;
      }
      case 'portraitbottomleft': {
        baconMonitorOrientation = MonitorOrientationType.PortraitBottomLeft;
      }
    }

    // TODO NoOverscan vs. noOverscan
    // if (!getEnumKeyOfValue(MonitorOverscanType, monitorOverscan)) debugger;
    // if (!getEnumKeyOfValue(TouchCursorDisplayModeType, touchCursorDisplayMode)) debugger;
    if (!getEnumKeyOfValue(UdpAddressType, udpDestinationAddressType)) {
      throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
        'UdpAddressType: ' + udpDestinationAddressType);
    }
    if (!getEnumKeyOfValue(VideoConnectorType, videoConnector)) {
      throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError, 'VideoConnectorType: ' + videoConnector);
    }

    const { a, r, g, b } = bpf.metadata.backgroundScreenColor;
    const backgroundScreenColor: BsColor = { a, r, g, b };

    // TODO - the following variable(s) are in the bsdm definition but not yet imported from bpf
    //    networkedVariablesUpdateInterval - note that this appears in bpfToJson.ts#metadataSpec
    //
    signAction = dispatch(dmUpdateSignProperties(
      {
        id: signProperties.id,
        alphabetizeVariableNames,
        autoCreateMediaCounterVariables,
        backgroundScreenColor,
        delayScheduleChangeUntilMediaEndEvent,
        deviceWebPageDisplay,
        flipCoordinates,
        forceResolution,
        graphicsZOrder,
        htmlEnableJavascriptConsole,
        inactivityTime,
        inactivityTimeout,
        isMosaic,
        language,
        languageKey,
        monitorOrientation: (baconMonitorOrientation as MonitorOrientationType),
        monitorOverscan,
        resetVariablesOnPresentationStart,
        tenBitColorEnabled,
        dolbyVisionEnabled: dolbyVision,
        fullResGraphicsEnabled,
        audioConfiguration,
        audioAutoLevel,
        touchCursorDisplayMode,
        udpDestinationAddress,
        udpDestinationAddressType,
        udpDestinationPort,
        udpReceiverPort,
        videoConnector,
      }
    ));

    console.log(getState().bsdm);

  };
}

// TODO - more parameters in bpf but perhaps not yet in bsdm
function setSignAudioProperties(bpf: any): Function {

  return (dispatch: Function): any => {
    const bpfAudioVolumeNames: string[] = [
      'audio1',
      'audio2',
      'audio3',
      'hdmi',
      'spdif',
      'usbA',
      'usbB',
      'usbC',
      'usbD',
    ];

    const bpfxAudioOutputs: string[] = [
      'analog1',
      'analog2',
      'analog3',
      'hdmi',
      'spdif',
      'usbA',
      'usbB',
      'usbC',
      'usbD',
    ];

    const audioSignPropertyMap: DmAudioSignPropertyMap = {};
    let audioSignProperties: DmAudioSignProperties;

    for (let i = 0; i < bpfAudioVolumeNames.length; i++) {
      audioSignProperties = {
        min: bpf.metadata[bpfAudioVolumeNames[i] + 'MinVolume'],
        max: bpf.metadata[bpfAudioVolumeNames[i] + 'MaxVolume'],
      };
      audioSignPropertyMap[bpfxAudioOutputs[i]] = audioSignProperties;
    }

    const audioSignPropertyMapParams: AudioSignPropertyMapParams = {
      params: audioSignPropertyMap
    };

    dispatch(dmUpdateSignAudioPropertyMap(audioSignPropertyMapParams));
  };
}

// LOOKS OK
function setSerialPortConfiguration(bpf: any): Function {
  return (dispatch: Function): any => {
    const serialPortList: DmSerialPortList = bpf.metadata.SerialPortConfigurations.map(
      (serialPortConfiguration: DmSerialPortConfiguration): DmSerialPortConfiguration => {
        return serialPortConfiguration;
      });
    dispatch(dmUpdateSignSerialPorts({
      params: serialPortList
    }));
  };
}

// TODO - more parameters in bpf but perhaps not yet in bsdm
function buildAudioOutputAssignmentMap(zoneSpecificParameters: any): DmAudioOutputAssignmentMap {

  const bpfAudioOutputs: string[] = [
    'analogOutput',
    'analog2Output',
    'analog3Output',
    'hdmiOutput',
    'spdifOutput',
    'usbOutputA',
    'usbOutputB',
    'usbOutputC',
    'usbOutputD',
  ];

  const bpfxAudioOutputs: string[] = [
    'analog1',
    'analog2',
    'analog3',
    'hdmi',
    'spdif',
    'usbA',
    'usbB',
    'usbC',
    'usbD',
  ];

  const audioOutputAssignments: DmAudioOutputAssignmentMap = {};

  for (let i = 0; i < bpfAudioOutputs.length; i++) {
    audioOutputAssignments[bpfxAudioOutputs[i]] =
      Converters.getAudioOutputType(zoneSpecificParameters[bpfAudioOutputs[i]]);
  }

  return audioOutputAssignments;
}

// TENTATIVE OK
function getVideoZonePropertyData(zoneSpecificParameters: any): DmVideoZonePropertyData {

  if (!getEnumKeyOfValue(LiveVideoInputType, zoneSpecificParameters.liveVideoInput)) {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'LiveVideoInputType: ' + zoneSpecificParameters.liveVideoInput);
  }
  if (!getEnumKeyOfValue(LiveVideoStandardType, zoneSpecificParameters.liveVideoStandard)) {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'LiveVideoStandardType: ' + zoneSpecificParameters.liveVideoStandard);
  }
  if (!getEnumKeyOfValue(AudioMixModeType, zoneSpecificParameters.audioMixMode)) {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'AudioMixModeType: ' + zoneSpecificParameters.audioMixMode);
  }

  const videoZonePropertyData: DmVideoZonePropertyData = {
    viewMode: Converters.getViewMode(zoneSpecificParameters.viewMode),
    liveVideoInput: zoneSpecificParameters.liveVideoInput,
    liveVideoStandard: zoneSpecificParameters.liveVideoStandard,
    videoVolume: zoneSpecificParameters.videoVolume,
    brightness: zoneSpecificParameters.brightness,
    contrast: zoneSpecificParameters.contrast,
    saturation: zoneSpecificParameters.saturation,
    hue: zoneSpecificParameters.hue,
    zOrderFront: zoneSpecificParameters.zOrderFront,
    mosaic: zoneSpecificParameters.mosaic,
    maxContentResolution: Converters.getMosaicMaxContentResolution(zoneSpecificParameters.maxContentResolution),
  };

  return videoZonePropertyData;
}

// TENTATIVE OK
function getAudioZonePropertyData(zoneSpecificParameters: any): DmAudioZonePropertyData {

  const audioOutputAssignmentMap: DmAudioOutputAssignmentMap =
    buildAudioOutputAssignmentMap(zoneSpecificParameters);

  if (!getEnumKeyOfValue(AudioMixModeType, zoneSpecificParameters.audioMixMode)) {
    throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError,
      'AudioMixModeType: ' + zoneSpecificParameters.audioMixMode);
  }

  const audioZonePropertyData: DmAudioZonePropertyData = {
    audioOutput: Converters.getAudioOutput(zoneSpecificParameters.audioOutput),
    audioMode: Converters.getAudioMode(zoneSpecificParameters.audioMode),
    audioMapping: Converters.getAudioMapping(zoneSpecificParameters.audioMapping),
    audioOutputAssignments: audioOutputAssignmentMap,
    audioMixMode: zoneSpecificParameters.audioMixMode,
    audioVolume: zoneSpecificParameters.audioVolume,
    minimumVolume: zoneSpecificParameters.minimumVolume,
    maximumVolume: zoneSpecificParameters.maximumVolume,
  };

  return audioZonePropertyData;
}

// TODO
//      break into multiple functions
//      not all zone types are implemented or fully implemented - see below
function setZoneProperties(bpfZone: any, zoneId: BsDmId, zoneType: ZoneType): Function {

  return (dispatch: Function, getState: Function): any => {
    switch (zoneType) {
      case ZoneType.VideoOrImages: {

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

        const imageMode: ImageModeType = Converters.getImageMode(zoneSpecificParameters.imageMode);

        const imageZonePropertyData: DmImageZonePropertyData = {
          imageMode,
        };
        const imageZoneProperties: DmImageZoneProperties = imageZonePropertyData;

        const audioZonePropertyData: DmAudioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

        const videoZonePropertyData: DmVideoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

        const videoZoneProperties: DmVideoZoneProperties =
          Object.assign({}, videoZonePropertyData, audioZonePropertyData);

        const zonePropertyParams: VideoOrImagesZonePropertyParams =
          Object.assign({}, videoZoneProperties, imageZoneProperties);

        const zonePropertyUpdateParams: ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.VideoOrImages,
          properties: zonePropertyParams
        };
        const updateZonePropertyThunkAction: BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        dispatch(updateZonePropertyThunkAction);
        break;
      }
      case ZoneType.VideoOnly: {

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

        const audioZonePropertyData: DmAudioZonePropertyData = getAudioZonePropertyData(zoneSpecificParameters);

        const videoZonePropertyData: DmVideoZonePropertyData = getVideoZonePropertyData(zoneSpecificParameters);

        const videoZoneProperties: DmVideoZoneProperties =
          Object.assign({}, videoZonePropertyData, audioZonePropertyData);

        const zonePropertyParams: VideoZonePropertyParams =
          Object.assign({}, videoZoneProperties);

        const zonePropertyUpdateParams: ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.VideoOnly,
          properties: zonePropertyParams
        };
        const updateZonePropertyThunkAction: BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        dispatch(updateZonePropertyThunkAction);
        break;
      }
      case ZoneType.Images: {
        break;
      }
      case ZoneType.AudioOnly: {
        break;
      }
      case ZoneType.EnhancedAudio: {
        break;
      }
      case ZoneType.Ticker: {

        // const zoneProperties: DmZoneSpecificProperties = dmGetZonePropertiesById(getState().bsdm, { id: zoneId });
        // const tickerZoneProperties: DmTickerZoneProperties = zoneProperties as DmTickerZoneProperties;

        const zoneSpecificParameters = bpfZone.zoneSpecificParameters;

        const textWidgetParameters: any = zoneSpecificParameters.textWidget;
        const widgetParameters: any = zoneSpecificParameters.widget;

        const rotation: RotationType = getRotation(textWidgetParameters.rotation);

        let alignment: TextHAlignmentType = TextHAlignmentType.Left;
        if (textWidgetParameters.alignment === 'center') {
          alignment = TextHAlignmentType.Center;
        }
        else {
          alignment = TextHAlignmentType.Right;
        }

        let scrollingMethod: TextScrollingMethodType = TextScrollingMethodType.Animated;
        if (textWidgetParameters.scrollingMethod === 1) {
          scrollingMethod = TextScrollingMethodType.StaticText;
        }
        else if (textWidgetParameters.scrollingMethod === 3) {
          scrollingMethod = TextScrollingMethodType.Scrolling;
        }
        // TODO - can scrollingMethod === 2?

        const textWidget: DmTextWidget = {
          numberOfLines: textWidgetParameters.numberOfLines,
          delay: textWidgetParameters.delay,
          rotation,
          alignment,
          scrollingMethod,
        };

        const foregroundTextColor: BsColor = getBsColor(widgetParameters.foregroundTextColor);
        const backgroundTextColor: BsColor = getBsColor(widgetParameters.backgroundTextColor);

        // font: tickerZoneProperties.widget.font,
        // fontSize: tickerZoneProperties.widget.fontSize,
        // safeTextRegion: widgetParameters.safeTextRegion,
        // TODO
        const safeTextRegion: BsRect = {
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          pct: false
        };

        let bsAssetItem: BsAssetItem = null;

        const backgroundBitmapFilePath: string = widgetParameters.backgroundBitmap;
        if (backgroundBitmapFilePath !== '') {
          bsAssetItem = fsGetAssetItemFromFile(backgroundBitmapFilePath);
          if (isNil(bsAssetItem)) {
            bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, path.basename(backgroundBitmapFilePath),
              backgroundBitmapFilePath);
          }
        }
        const widget: DmWidget = {
          foregroundTextColor,
          backgroundTextColor,
          font: widgetParameters.font,
          fontSize: widgetParameters.fontSize,
          stretchBitmapFile: widgetParameters.stretchBitmapFile,
          safeTextRegion,
          backgroundBitmapAssetId: BsAssetIdNone,
        };

        const tickerZonePropertyParams: TickerZonePropertyParams = {
          textWidget,
          widget,
          scrollSpeed: zoneSpecificParameters.scrollSpeed
        };

        // TODO - why not assign unconditionally?
        // if (!isNil(bsAssetItem) && !linkBroken) {
        //   tickerZonePropertyParams.backgroundAsset = bsAssetItem;
        // }
        tickerZonePropertyParams.backgroundAsset = bsAssetItem;

        const zonePropertyUpdateParams: ZonePropertyUpdateParams = {
          id: zoneId,
          type: ZoneType.Ticker,
          properties: tickerZonePropertyParams
        };

        const updateZonePropertyThunkAction: BsDmThunkAction<ZonePropertyUpdateParams> =
          dmUpdateZoneProperties(zonePropertyUpdateParams);
        const updateZonePropertyAction: ZonePropertyUpdateAction = dispatch(updateZonePropertyThunkAction);

        break;
      }
      case ZoneType.Clock: {
        break;
      }
      case ZoneType.BackgroundImage: {
        break;
      }
      default: {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError, 'setZoneProperties: ' + zoneType);
      }
    }
  };
}

// LOOKS OK
function getBsColor(bpfColorSpec: any): BsColor {
  const { a, r, g, b } = bpfColorSpec;
  const color: BsColor = { a, r, g, b };
  return color;
}

function addImageItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    // TODO - support videoPlayerRequired
    // TODO - verify that slideDelayInterval is not used in non interactive.
    const { file, fileIsLocal, slideDelayInterval, slideTransition, transitionDuration, videoPlayerRequired } = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, container, bsAssetItem,
      { defaultTransition: getTransitionType(slideTransition), transitionDuration });
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// TODO - see below
function addVideoItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    // TODO - why are some of these parameters unused?
    // TODO - how is volume handled for non interactive?
    // TODO _ support automaticallyLoop
    // TODO - could support videoDisplayMode - bsdm does.
    const { automaticallyLoop, file, fileIsLocal, videoDisplayMode, volume } = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, container, bsAssetItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// TODO - volume?
function addAudioItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    // TODO - why are some of these parameters unused?
    const { file, fileIsLocal, volume } = state;

    const fileName = file.name;
    const filePath = file.path;
    let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
    if (!bsAssetItem) {
      bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.Content, fileName,
        filePath);
    }

    const addMediaStateThunkAction = dmAddMediaState(bsAssetItem.name, container, bsAssetItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// TODO anything with timeOnScreen?
function addLiveVideoItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const { overscan, timeOnScreen, volume } = state;

    const liveVideoContentItem: DmLiveVideoContentItem =
      dmCreateLiveVideoContentItem(state.name, volume, overscan);

    const addMediaStateThunkAction = dmAddMediaState(state.name, container, liveVideoContentItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

function addMjpegStreamItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const url = convertToParameterizedString(getState().bsdm, state.url);

    const rotation: RotationType = getRotation(state.rotation);
    const mjpegStreamContentItem: DmMjpegStreamContentItem =
      dmCreateMjpegStreamContentItem(state.name, url, rotation);

    const addMediaStateThunkAction: BsDmThunkAction<MediaStateParams> =
      dmAddMediaState(state.name, container, mjpegStreamContentItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// LOOKS OK
function addVideoStreamItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const url = convertToParameterizedString(getState().bsdm, state.url);

    const videoStreamContentItem: DmVideoStreamContentItem =
      dmCreateVideoStreamContentItem(state.name, url);

    const addMediaStateThunkAction: BsDmThunkAction<MediaStateParams> =
      dmAddMediaState('videoStream', container, videoStreamContentItem);
    const mediaStateAction: MediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams: MediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// TODO - HACK below
function addRssDataFeedPlaylistItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: state.liveDataFeedName });

    // TODO - HACK!!
    state.name = state.liveDataFeedName;
    const rssDataFeedContentItem: DmDataFeedContentItem = dmCreateDataFeedContentItem(
      state.name, dmcDataFeed.id
    );

    const addMediaStateThunkAction = dmAddMediaState(state.name, container, rssDataFeedContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

function addUserVariableInTickerItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    // const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: state.liveDataFeedName });

    // // TODO - HACK!!
    // state.name = state.liveDataFeedName;
    // const rssDataFeedContentItem: DmDataFeedContentItem = dmCreateDataFeedContentItem(
    //   state.name, dmcDataFeed.id
    // );

    // const addMediaStateThunkAction = dmAddMediaState(state.name, container, rssDataFeedContentItem);
    // const mediaStateAction = dispatch(addMediaStateThunkAction);
    // const mediaStateParams = mediaStateAction.payload;

    // return mediaStateParams.id;
    return BsDmIdNone;
  };
}

// NO IDEA
function addMrssDataFeedPlaylistItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: state.liveDataFeedName });

    const mrssDataFeedContentItem: DmMrssDataFeedContentItem = dmCreateMrssDataFeedContentItem(
      state.stateName, dmcDataFeed.id, state.videoPlayerRequired);

    const addMediaStateThunkAction = dmAddMediaState(state.name, container, mrssDataFeedContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// LOOKS OK
function addEventHandlerItem(container: DmMediaStateContainer, state: any) {
  return (dispatch: Function, getState: Function): any => {

    const { stopPlayback } = state;

    const eventHandlerContentItem: DmEventHandlerContentItem =
      dmCreateEventHandlerContentItem(state.name, stopPlayback);
    const addMediaStateThunkAction = dmAddMediaState(state.name, container,
      eventHandlerContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// NO KNOWN ISSUES
// TODO mediaType
function addPlayFileItem(container: DmMediaStateContainer, state: any) {
  return (dispatch: Function, getState: Function): any => {
    const { filesTable, liveDataFeedName, mediaType, slideTransition, specifyLocalFiles, stateName,
      type, useDefaultMedia, useUserVariable, userVariable, defaultMediaFileName, defaultMediaFileNameSuffix, defaultMediaFilePath } = state;

    let dataFeedId: BsDmId = BsDmIdNone;

    if (isString(liveDataFeedName) && liveDataFeedName.length > 0) {
      const dataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: liveDataFeedName });
      dataFeedId = dataFeed.id;
    }

    // TODO - dataFeeds

    const playFileContentItemProperties: PlayFileContentItemProperties = {
      triggerType: useUserVariable ? PlayFileTriggerType.ByUserVariable : PlayFileTriggerType.ByEventData,
      useDefaultMedia,
      userVariableIdOrName: useUserVariable ? userVariable.name : '',
      useDataFeed: isString(dataFeedId) && dataFeedId.length > 0 && dataFeedId !== BsDmIdNone,
    }
    const playFileContentItem: DmPlayFileContentItem = dmCreatePlayFileContentItem(stateName, playFileContentItemProperties);
    const addMediaStateThunkAction = dmAddMediaState(state.name, container, playFileContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;
    const playFileStateId: BsDmId = mediaStateParams.id;

    if (useDefaultMedia) {
      const defaultMediaAssetItem = dmCreateAssetItemFromLocalFile(defaultMediaFilePath);
      const mediaStateUpdateParams: MediaStateUpdateParams = {
        id: playFileStateId,
        contentData: { useDefaultMedia: true },
        contentAdditionalAsset: { defaultMedia: defaultMediaAssetItem },
      };
      dispatch(dmUpdateMediaState(mediaStateUpdateParams) as any);
    }

    const assetItems: BsAssetItem[] = [];
    const mediaSequenceContentItemData: any[] = [];

    if (specifyLocalFiles && isArray(filesTable)) {
      filesTable.forEach((file: any) => {
        // const { export, key, label, name, path, suffix, type, videoDisplayMode } = file;
        const { key, label, name, suffix, videoDisplayMode } = file;
        const exportKey: boolean = file.export;
        const filePath: string = file.path;   // broken link issue - problem here? TODO
        const fileType: string = file.type;

        const assetLocator: BsAssetLocator = bscAssetLocatorForLocalAsset(AssetType.Content, filePath);
        const assetItem = bscAssetItemFromAssetLocator(assetLocator);

        assetItems.push(assetItem);

        mediaSequenceContentItemData.push({
          key,
          name: label,
          exportKey,
          defaultTransition: getTransitionType(slideTransition),
        });
      });

      const mediaStateSequence: DmMediaStateSequence | null = dmGetMediaStateSequenceForContainer(getState().bsdm, { id: playFileStateId });
      let targetIndex = 0;
      if (!isNil(mediaStateSequence)) {
        targetIndex = (mediaStateSequence as DmMediaStateSequence).sequence.length;
      }

      const playFileStateContainer = { id: playFileStateId, type: MediaStateContainerType.PlayFile };

      const addPlayFileItemsAction = dmMediaSequenceAddItemRange(targetIndex, playFileStateContainer, assetItems,
        mediaSequenceContentItemData);
      dispatch(addPlayFileItemsAction as any);
    }

    return playFileStateId;
  };
}

// NO KNOWN ISSUES other than the TODO's below
function addSuperStateItem(container: DmMediaStateContainer, state: any) {
  return (dispatch: Function, getState: Function): any => {

    const stateName: string = state.name;
    const initialStateName: string = state.initialState;

    const superStateHandlerContentItem: DmSuperStateContentItem =
      dmCreateSuperStateContentItem(stateName);
    const addMediaStateThunkAction = dmAddMediaState(state.name, container,
      superStateHandlerContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    const superStateStateId = mediaStateParams.id;
    const superStateContentItem: DmSuperStateContentItem =
      cloneDeep(mediaStateParams.contentItem as DmSuperStateContentItem);

    const mediaStateContainer: DmcMediaStateContainer =
      dmGetMediaStateContainer(superStateStateId, MediaStateContainerType.SuperState);

    dispatch(addStatesToZone(mediaStateContainer, state.states, true));

    const initialState: DmcMediaState = dmGetMediaStateByName(getState().bsdm, { name: initialStateName });

    superStateContentItem.initialMediaStateId = initialState.id;
    const superStateUpdateParams: MediaStateUpdateParams = {
      id: mediaStateContainer.id,
      contentData: superStateContentItem,
    };
    dispatch(dmUpdateMediaState(superStateUpdateParams));

    return superStateStateId;
  };
}

function addMediaListItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const { advanceOnImageTimeout, advanceOnMediaEnd, imageTimeout, liveDataFeedName, mediaType, nextEvent,
      nextTransitionCommands, playFromBeginning,
      populateFromMediaLibrary, previousEvent, previousTransitionCommands, sendZoneMessage,
      shuffle, slideTransition, startIndex, support4KImages, transitionDuration } = state;

    const name = state.name;

    const mediaListPlaybackType: MediaListPlaybackType = playFromBeginning ? MediaListPlaybackType.FromIndex :
      MediaListPlaybackType.NextInList;

    let dataFeedId: BsDmId = BsDmIdNone;

    if (isString(liveDataFeedName) && liveDataFeedName.length > 0) {
      const dataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: liveDataFeedName });
      dataFeedId = dataFeed.id;
    }

    const mediaListContentItemProperties: MediaListContentItemProperties = {
      playbackType: mediaListPlaybackType,
      startIndex,
      shuffle,
      support4KImage: support4KImages,
      useDataFeed: isString(liveDataFeedName) && liveDataFeedName.length > 0,
      transition: getTransitionType(slideTransition),
      transitionDuration,
      autoTransitions: false,
      sendMediaZoneMessage: sendZoneMessage
    };
    const mediaListContentItem = dmCreateMediaListContentItem(state.name);
    const addMediaStateThunkAction = dmAddMediaState(state.name, container, mediaListContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;
    const mediaListStateId = mediaStateParams.id;
    const mediaListStateContainer = { id: mediaListStateId, type: MediaStateContainerType.MediaList };

    if (dataFeedId === BsDmIdNone) {

      const assetItems: any[] = [];

      state.files.forEach((file: any) => {
        const fullPath = file.file.path;
        const assetLocator: BsAssetLocator = bscAssetLocatorForLocalAsset(AssetType.Content, fullPath);
        const assetItem: BsAssetItem = bscAssetItemFromAssetLocator(assetLocator);
        assetItems.push(assetItem);
      });

      const addMediaListItemsAction = dmMediaSequenceAddItemRange(0, mediaListStateContainer, assetItems);
      dispatch(addMediaListItemsAction as any);
    }
    else {
      // TODO - this only works for bsn data feeds, not data feeds via url
      const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: liveDataFeedName });
      const bsnMediaFeedAsset: BsAssetItem = dmcDataFeed.bsnAssetItem;
      const bsnMediaDataFeedSpec = dmCreateBsnDataFeedSpecification(bsnMediaFeedAsset, DataFeedUsageType.Content);
      const updateParams = {
        id: mediaListStateId,
        contentData: {useDataFeed: true},
        contentAdditionalAsset: {dataFeedSpec: bsnMediaDataFeedSpec},
      };
      dispatch(dmUpdateMediaState(updateParams));
    }

    let eventType: EventType;
    let eventData: DmEventData;

    if (advanceOnImageTimeout) {
      eventType = EventType.Timer;
      eventData = {
        interval: imageTimeout,
      } as DmTimer;
      const advanceOnImageTimeoutEventSpecification: DmEventSpecification =
        dmCreateDefaultEventSpecificationForEventType(eventType, eventData);
      dispatch(addMediaListTransitionEvent(mediaStateParams.id, advanceOnImageTimeoutEventSpecification, true));
    }

    if (advanceOnMediaEnd) {
      eventType = EventType.MediaEnd;
      eventData = null;
      const advanceOnMediaEndEventSpecification: DmEventSpecification =
        dmCreateDefaultEventSpecificationForEventType(eventType, eventData);
      dispatch(addMediaListTransitionEvent(mediaStateParams.id, advanceOnMediaEndEventSpecification, true));
    }

    // // TODO - are these hardcoded parameters unused in this situation?
    const nextEventSpecification: DmEventSpecification =
      getEventSpecificationFromUserEvent(
        getState().bsdm,
        nextEvent,
        null,
        null,
        false,
        false,
        BsDmIdNone,
        false,
        BsDmIdNone,
      );
    if (!isNil(nextEventSpecification)) {
      dispatch(addMediaListTransitionEvent(mediaStateParams.id, nextEventSpecification, true));
    }

    const previousEventSpecification: DmEventSpecification =
      getEventSpecificationFromUserEvent(
        getState().bsdm,
        previousEvent,
        null,
        null,
        false,
        false,
        BsDmIdNone,
        false,
        BsDmIdNone,
      );
    if (!isNil(previousEventSpecification)) {
      dispatch(addMediaListTransitionEvent(mediaStateParams.id, previousEventSpecification, false));
    }

    if (!isNil(nextTransitionCommands)) {
      dispatch(addMediaListTransitionCommands(mediaStateParams.id, nextTransitionCommands,
        CommandSequenceType.SequenceItemNext));
    }
    if (!isNil(previousTransitionCommands)) {
      dispatch(addMediaListTransitionCommands(mediaStateParams.id, previousTransitionCommands,
        CommandSequenceType.SequenceItemNext));
    }

    const mediaListState: DmcMediaListMediaState =
      dmGetMediaStateById(getState().bsdm, { id: mediaStateParams.id }) as DmcMediaListMediaState;
  };
}

// TODO - event name
function addMediaListTransitionEvent(mediaListStateId: BsDmId, eventSpecification: DmEventSpecification,
  forwardEvent: boolean) {
  return (dispatch: Function) => {
    const mediaStateContainer: DmcMediaStateContainer =
      dmGetMediaStateContainer(mediaListStateId, MediaStateContainerType.MediaList);
    dispatch(dmMediaListAddGlobalEvent('mediaListEventName', mediaStateContainer, eventSpecification, !forwardEvent));
  };
}

// LOOKS OK
function addMediaListTransitionCommands(mediaListStateId: BsDmId, mediaListTransitionCommands: any[],
  commandSequenceType: CommandSequenceType) {
  return (dispatch: Function, getState: Function) => {
    const mediaStateContainer: DmcMediaStateContainer =
      dmGetMediaStateContainer(mediaListStateId, MediaStateContainerType.MediaList);

    mediaListTransitionCommands.forEach((mediaListTransitionCommand) => {
      const command: DmCommand = buildCommand(getState().bsdm, mediaListTransitionCommand.command);
      const addCommandAction: BsDmThunkAction<CommandAddParams> =
        dmAddCommand(commandSequenceType, mediaStateContainer.id, command);
      dispatch(addCommandAction);
    });
  };
}

function buildSendBpOutputCommand(bsdm: DmState, bpfCommand: any): DmCommand {

  let commandDataParams: CommandDataParams;
  let ps: DmParameterizedString;

  let buttonNumber: number;
  let bpAction: BpAction;
  let bpIndex: BpIndex;
  let bpType: BpType;

  bpfCommand.command.parameters.forEach((commandParameter: any) => {
    ps = convertToParameterizedString(bsdm, commandParameter.parameterValue);
    const psAsString: string = ps.params[0].value;
    switch (commandParameter.name) {
      case 'buttonNumber':
        buttonNumber = Number(psAsString);
        break;
      case 'action':
        switch (psAsString) {
          case 'on':
            bpAction = BpAction.On;
            break;
          case 'off':
            bpAction = BpAction.Off;
            break;
          case 'fastBlink':
            bpAction = BpAction.FastBlink;
            break;
          case 'mediumBlink':
            bpAction = BpAction.MediumBlink;
            break;
          case 'slowBlink':
            bpAction = BpAction.SlowBlink;
            break;
        }
        break;
      case 'buttonPanelIndex':
        bpIndex = getBpIndexFromButtonPanelIndex(Number(psAsString));
        break;
      case 'buttonPanelType':
        bpType = getBpTypeFromButtonPanelType(psAsString);
        break;
      default:
        debugger;
        break;
    }
  });
  commandDataParams = {
    bpType,
    bpIndex,
    buttonNumber,
    bpAction,
  }
  return dmCreateCommand('sendBPOutput', CommandType.SendBpOutput, commandDataParams);
}

function buildSetZoneVolumeCommand(bsdm: DmState, bpfCommand: any): DmCommand {

  let zoneId: string;
  let volume: DmParameterizedNumber;
  let commandDataParams: CommandDataParams;

  bpfCommand.command.parameters.forEach((commandParameter: any) => {
    switch (commandParameter.name) {
      case 'zoneId':
        const ps = convertToParameterizedString(bsdm, commandParameter.parameterValue);
        zoneId = ps.params[0].value;
        break;
      case 'volume':
        volume = convertToParameterizedNumber(bsdm, commandParameter.parameterValue);
        break;
      default:
        debugger;
        break;
    };
  });

  commandDataParams = {
    zoneId,
    volume,
  }
  return dmCreateCommand('setZoneVolume', CommandType.SetZoneVolume, commandDataParams);
}


function buildSetConnectorVolumeCommand(bsdm: DmState, bpfCommand: any): DmCommand {

  let pn: DmParameterizedNumber;

  let connector: AudioOutputName;
  bpfCommand.command.parameters.forEach((commandParameter: any) => {
    switch (commandParameter.name) {
      case 'connector':
        switch (commandParameter.parameterValue.parameterValueItems[0].textValue) {
          case 'Analog':
          case 'Analog1':
            connector = AudioOutputName.Analog1;
            break;
          case 'Analog2':
            connector = AudioOutputName.Analog2;
            break;
          case 'Analog3':
            connector = AudioOutputName.Analog3;
            break;
          case 'HDMI':
            connector = AudioOutputName.Hdmi;
            break;
          case 'SPDIF':
            connector = AudioOutputName.Spdif;
            break;
          case 'USBA':
            connector = AudioOutputName.UsbA;
            break;
          case 'USBB':
            connector = AudioOutputName.UsbB;
            break;
          case 'USBC':
            connector = AudioOutputName.UsbC;
            break;
          case 'USBD':
            connector = AudioOutputName.UsbD;
            break;
          default:
            debugger;
            break;
        }
        break;
      case 'volume':
        pn = convertToParameterizedNumber(bsdm, commandParameter.parameterValue);
        break;
    }
  });
  return dmCreateCommand('setConnectorVolume', CommandType.SetConnectorVolume,
    {
      connector,
      volume: pn
    });
}

// TODO - add support for all command types
function buildCommand(bsdm: DmState, bpfCommand: any): DmCommand | null {

  let command = null;
  let commandDataParams: CommandDataParams;
  let ps: DmParameterizedString;
  let pn: DmParameterizedNumber;

  switch (bpfCommand.command.name) {

    case 'sendZoneMessage':
      // zoneMessage
      // textValue
      /*
export interface DmMessageCommandData {
    messageData: DmParameterizedString;
}
      */
      break;
    case 'setZoneVolume':
      command = buildSetZoneVolumeCommand(bsdm, bpfCommand);
      break;
    case 'sendBPOutput':
      command = buildSendBpOutputCommand(bsdm, bpfCommand);
      break;
    case 'synchronize':
      ps = convertToParameterizedString(bsdm, bpfCommand.command.parameters[0].parameterValue);
      commandDataParams = {
        messageData: ps,
      };
      command = dmCreateCommand('synchronize', CommandType.Synchronize, commandDataParams);
      break;

    // TODO broken in bsdm as of 10/14/2018
    case 'pause':
      pn = convertToParameterizedNumber(bsdm, bpfCommand.command.parameters[0].parameterValue);
      command = dmCreateCommand('pause', CommandType.Pause, { pauseTime: pn });
      break;
    case 'setConnectorVolume':
      command = buildSetConnectorVolumeCommand(bsdm, bpfCommand);
      break;
    case 'setVariable':
      // TODO - placeholder
      command = dmCreateCommand('resetVariables', CommandType.ResetVariables);
      break;
    case 'resetVariables':
      command = dmCreateCommand('resetVariables', CommandType.ResetVariables);
      break;
  }

  return command;
}

// PENDING NODE SUPPORT and NOT FULLY FEATURED
function addHtmlItem(container: DmMediaStateContainer, state: any): Function {

  return (dispatch: Function, getState: Function): any => {

    const { enableExternalData, enableMouseEvents, displayCursor, htmlSiteName, hwzOn, name, timeOnScreen, type,
      useUserStylesheet, userStylesheet } = state;

    const dmcHtmlSite: DmcHtmlSite = dmGetHtmlSiteByName(getState().bsdm, { name: htmlSiteName });

    // userStylesheetAssetId - TODO
    // no customFonts
    const htmlContentItem: DmHtmlContentItem = dmCreateHtmlContentItem(name, dmcHtmlSite.id, enableExternalData,
      enableMouseEvents, displayCursor, hwzOn, useUserStylesheet);

    const addMediaStateThunkAction = dmAddMediaState(state.name, container,
      htmlContentItem);
    const mediaStateAction = dispatch(addMediaStateThunkAction);
    const mediaStateParams = mediaStateAction.payload;

    return mediaStateParams.id;
  };
}

// LOOKS OK
function createTimeoutEventData(mediaStateId: BsDmId, timeout: number) {
  return {
    mediaStateId,
    eventSpecification: {
      type: EventType.Timer,
      data: {
        interval: timeout
      }
    }
  };
}

// LOOKS OK
function createMediaEndEventData(mediaStateId: BsDmId) {
  return {
    mediaStateId,
    eventSpecification: {
      type: EventType.MediaEnd,
      data: null as any
    }
  };
}

function addStatesToZone(mediaStateContainer: DmMediaStateContainer, states: any[], isInteractive: boolean) {

  let mediaStateId: string;
  const eventData: any[] = [];

  return (dispatch: Function, getState: Function): any => {
    states.forEach((state: any) => {
      mediaStateId = '';
      switch (state.type) {
        case 'imageItem': {
          mediaStateId = dispatch(addImageItem(mediaStateContainer, state));
          eventData.push(createTimeoutEventData(mediaStateId, state.slideDelayInterval));
          break;
        }
        case 'videoItem': {
          mediaStateId = dispatch(addVideoItem(mediaStateContainer, state));
          eventData.push(createMediaEndEventData(mediaStateId));
          break;
        }
        case 'audioItem': {
          mediaStateId = dispatch(addAudioItem(mediaStateContainer, state));
          eventData.push(createMediaEndEventData(mediaStateId));
          break;
        }
        case 'liveVideoItem': {
          mediaStateId = dispatch(addLiveVideoItem(mediaStateContainer, state));
          eventData.push(createTimeoutEventData(mediaStateId, Number(state.timeOnScreen)));
          break;
        }
        case 'audioStreamItem': // TODO - implement me
          break;
        case 'mjpegStreamItem':
          mediaStateId = dispatch(addMjpegStreamItem(mediaStateContainer, state));
          if (state.timeOnScreen === 0) {
            eventData.push(createMediaEndEventData(mediaStateId));
          }
          else {
            eventData.push(createTimeoutEventData(mediaStateId, state.timeOnScreen));
          }
          break;
        case 'videoStreamItem': {
          mediaStateId = dispatch(addVideoStreamItem(mediaStateContainer, state));
          if (state.timeOnScreen === 0) {
            eventData.push(createMediaEndEventData(mediaStateId));
          }
          else {
            eventData.push(createTimeoutEventData(mediaStateId, state.timeOnScreen));
          }
          break;
        }
        case 'mrssDataFeedItem': {
          mediaStateId = dispatch(addMrssDataFeedPlaylistItem(mediaStateContainer, state));
          eventData.push(createMediaEndEventData(mediaStateId));
          break;
        }
        case 'html5Item': {
          mediaStateId = dispatch(addHtmlItem(mediaStateContainer, state));
          eventData.push(createTimeoutEventData(mediaStateId, Number(state.timeOnScreen)));
          break;
        }
        case 'mediaListItem':
          mediaStateId = dispatch(addMediaListItem(mediaStateContainer, state));
          break;
        case 'eventHandlerItem':
          mediaStateId = dispatch(addEventHandlerItem(mediaStateContainer, state));
          break;
        case 'superStateItem':
          mediaStateId = dispatch(addSuperStateItem(mediaStateContainer, state));
          break;
        case 'playFileItem':
          mediaStateId = dispatch(addPlayFileItem(mediaStateContainer, state));
          break;
        case 'rssDataFeedPlaylistItem':
          mediaStateId = dispatch(addRssDataFeedPlaylistItem(mediaStateContainer, state));
          eventData.push(createMediaEndEventData(mediaStateId));
          break;
        case 'userVariableInTickerItem':
          // mediaStateId = dispatch(addUserVariableInTickerItem(mediaStateContainer, state));
          // eventData.push(createMediaEndEventData(mediaStateId));
          break;
        default:
          console.log('buildZonePlaylist: ', state.type);
          debugger;
          break;
      }

      if (isInteractive) {

        const bsdm: DmState = getState().bsdm;

        state.brightSignEntryCommands.forEach((brightSignCommand: any) => {
          const command: DmCommand = buildCommand(bsdm, brightSignCommand);
          const addCommandAction: BsDmThunkAction<CommandAddParams> =
            dmAddCommand(CommandSequenceType.StateEntry, mediaStateId, command);
          dispatch(addCommandAction);
        });

        state.brightSignExitCommands.forEach((brightSignCommand: any) => {
          const command: DmCommand = buildCommand(bsdm, brightSignCommand);
          const addCommandAction: BsDmThunkAction<CommandAddParams> =
            dmAddCommand(CommandSequenceType.StateExit, mediaStateId, command);
          dispatch(addCommandAction);
        });

        // if (isNumber(state.x) && isNumber(state.y) && isString(mediaStateId) && mediaStateId.length > 0) {
        //   dispatch(baPeUiModelAddInteractiveCanvasState({
        //     id: mediaStateId,
        //     position: {
        //       x: state.x,
        //       y: state.y,
        //     }
        //   }));
        // }
      }
    });
    return eventData;
  }
}

// TODO - add support for all state types?
function buildZonePlaylist(bpfZone: any, zoneId: BsDmId): Function {

  return (dispatch: Function, getState: Function): any => {

    const zone: DmMediaStateContainer = dmGetZoneMediaStateContainer(zoneId);

    const eventData = dispatch(addStatesToZone(zone, bpfZone.playlist.states, bpfZone.playlist.type === 'interactive'));

    // set initialState for  interactive zones - it's set by bsdm for non interactive zones.
    if (bpfZone.playlist.type === 'interactive' && isString(bpfZone.playlist.initialState) && bpfZone.playlist.initialState !== '') {
      const initialStateName = bpfZone.playlist.initialState;
      const initialState: DmcMediaState = dmGetMediaStateByName(getState().bsdm, { name: initialStateName });
      if (isObject(initialState)) {
        dispatch(dmUpdateZone({
          id: zone.id,
          initialMediaStateId: initialState.id
        }));
      }
    }

    if (bpfZone.playlist.states.length > 0) {
      if (bpfZone.playlist.type === 'interactive') {
        dispatch(buildInteractiveTransitions(bpfZone));
      }
      else {
        // TODO - same for other zones; better way to do this?
        if (bpfZone.type !== 'Ticker') {
          dispatch(buildNonInteractiveTransitions(eventData));
        }
      }
    }
  };
}

// LOOKS OK
function getBpTypeFromButtonPanelType(buttonPanelType: string): BpType {
  switch (buttonPanelType) {
    case 'BP200':
      return BpType.Bp200;
    case 'BP900':
    default:
      return BpType.Bp900;
  }
}

// LOOKS OK
function getBpIndexFromButtonPanelIndex(buttonPanelIndex: number): BpIndex {
  switch (buttonPanelIndex) {
    case 3:
      return BpIndex.D;
    case 2:
      return BpIndex.C;
    case 1:
      return BpIndex.B;
    case 0:
    default:
      return BpIndex.A;
  }
}

// LOOKS OK
function getPressContinuous(userEvent: any) {
  let pressContinuous: any = null;
  if (!isNil(userEvent.parameters.pressContinuous)) {
    pressContinuous = {
      repeatInterval: userEvent.parameters.pressContinuous.repeatInterval,
      initialHoldOff: userEvent.parameters.pressContinuous.initialHoldoff,
    };
  }
  return pressContinuous;
}

// TODO - investigate refactoring some of the transition code.
function buildInteractiveTransitions(bpfZone: any) {

  return (dispatch: Function, getState: Function) => {

    // TODO - just pass transition object?
    bpfZone.playlist.transitions.forEach((transition: any) => {
      dispatch(buildInteractiveTransition(
        transition.userEvent,
        transition.sourceMediaState,
        transition.targetMediaState,
        transition.conditionalTargets,
        transition.brightSignCommands,
        transition.displayMode,
        transition.labelLocation,
        transition.remainOnCurrentStateActions,
        transition.targetIsPreviousState,
        transition.assignInputToUserVariable,
        transition.variableToAssign,
        transition.assignWildcardToUserVariable,
        transition.variableToAssignFromWildcard));
    });
  };
}

// TODO - add support all user event types?
function getEventSpecificationFromUserEvent(
  bsdm: DmState,
  userEvent: any,
  targetMediaState: DmcMediaState | null,
  remainOnCurrentStateActions: any,
  targetIsPreviousState: boolean,
  assignInputToUserVariable: boolean,
  variableToAssign: string,
  assignWildcardToUserVariable: boolean,
  variableToAssignFromWildcard: string,
): DmEventSpecification {

  let eventType: EventType;
  let eventData: DmEventData;

  let userVariableToAssignId: BsDmId = BsDmIdNone;
  if (isString(variableToAssign) && variableToAssign.length > 0) {
    userVariableToAssignId = dmGetUserVariableIdForName(bsdm,
      { name: variableToAssign });
  }

  let userVariableToAssignWildcardId: BsDmId = BsDmIdNone;
  if (isString(variableToAssignFromWildcard) && variableToAssignFromWildcard.length > 0) {
    userVariableToAssignWildcardId = dmGetUserVariableIdForName(bsdm,
      { name: variableToAssignFromWildcard });
  }

  switch (userEvent.name) {
    case 'bp900AUserEvent': {
      eventType = EventType.Bp;

      eventData = {
        bpType: getBpTypeFromButtonPanelType(userEvent.parameters.buttonPanelType),
        bpIndex: getBpIndexFromButtonPanelIndex(userEvent.parameters.buttonPanelIndex),
        buttonNumber: userEvent.parameters.buttonNumber,
        pressContinuous: getPressContinuous(userEvent),
      } as DmBpEventData;

      break;
    }
    case 'timeout': {
      eventType = EventType.Timer;
      eventData = {
        interval: userEvent.parameters.parameter,
      } as DmTimer;
      break;
    }
    case 'gpioUserEvent': {
      eventType = EventType.Gpio;
      const buttonDirection: ButtonDirection = userEvent.parameters.buttonDirection.toLowerCase() === 'down' ?
        ButtonDirection.Down : ButtonDirection.Up;
      eventData = {
        buttonNumber: userEvent.parameters.buttonNumber,
        buttonDirection,
        pressContinuous: getPressContinuous(userEvent),
      } as DmGpioEventData;
      break;
    }
    case 'rectangularTouchEvent': {
      eventType = EventType.RectangularTouch;
      eventData = {
        regions: [
          {
            x: userEvent.parameters.x,
            y: userEvent.parameters.y,
            width: userEvent.parameters.width,
            height: userEvent.parameters.height,
            pct: false,
          }
        ]
      } as DmRectangularTouchEventData;
      break;
    }
    case 'mediaEnd': {
      eventType = EventType.MediaEnd;
      eventData = null;
      break;
    }
    case 'synchronize': {
      eventType = EventType.Synchronize;
      eventData = {
        data: userEvent.parameters.parameter
      } as DmSimpleEventData;
      break;
    }
    case 'udp': {
      eventType = EventType.Udp;
      eventData = {
        data: userEvent.parameters.parameter,
        label: userEvent.parameters.label,
        export: userEvent.parameters.export,
        assignInputToUserVariable,
        assignWildcardToUserVariable,
        userVariableToAssignInput: userVariableToAssignId,
        userVariableToAssignWildcard: userVariableToAssignWildcardId,
      } as DmUdpEventData;
      break;
    }
    case 'serial':
      eventType = EventType.Serial;
      eventData = {
        port: userEvent.parameters.parameter,
        data: userEvent.parameters.parameter2,
      } as DmSerialEventData;
      break;
    case 'keyboard': {
      eventType = EventType.Keyboard;
      eventData = {
        data: userEvent.parameters.parameter
      } as DmSimpleEventData;
      break;
    }
    case 'usb': {
      eventType = EventType.Usb;
      eventData = {
        data: userEvent.parameters.parameter
      } as DmSimpleEventData;
      break;
    }
    case 'timeClockEvent':
      eventType = EventType.TimeClock;
      switch (userEvent.parameters.type) {
        case 'timeClockDateTime':
          eventData = {
            type: DmTimeClockEventType.DailyOnce,
            data: {
              dateTime: new Date(userEvent.parameters.dateTime),
            },
          } as DmTimeClockEventData;
          break;
      }
      break;
    case 'zoneMessage': {
      eventType = EventType.ZoneMessage;
      eventData = {
        data: userEvent.parameters.parameter
      } as DmSimpleEventData;
      break;
    }
    case 'remote': {
      eventType = EventType.Remote;
      eventData = {
        data: userEvent.parameters.parameter
      } as DmSimpleEventData;
      break;
    }
    case 'pluginMessageEvent': {
      eventType = EventType.PluginMessage;
      eventData = {
        name: userEvent.parameters.name,
        message: userEvent.parameters.message,
        assignInputToUserVariable,
        assignWildcardToUserVariable,
        userVariableToAssignInput: userVariableToAssignId,
        userVariableToAssignWildcard: userVariableToAssignWildcardId,
      } as DmPluginMessageEventData;
      break;
    }
    // TODO - as of 10/8/208, there's a bug in bscore for DistanceUnits
    case 'gpsEvent': {
      eventType = EventType.Gps;
      eventData = {
        direction: userEvent.parameters.enterRegion ? RegionDirection.Enter : RegionDirection.Exit,
        radius: userEvent.parameters.gpsRegion.radius,
        distanceUnits:
          userEvent.parameters.gpsRegion.radiusUnitsInMiles ? DistanceUnits.Miles : DistanceUnits.Kilometers,
        latitude: userEvent.parameters.gpsRegion.latitude,
        longitude: userEvent.parameters.gpsRegion.longitude,
      } as DmGpsEventData;
      break;
    }
    // TODO - temporary
    case 'audioTimeCodeEvent': {
      eventType = EventType.MediaEnd;
      eventData = null;
      break;
    }
    // TODO - temporary
    case 'videoTimeCodeEvent': {
      eventType = EventType.MediaEnd;
      eventData = null;
      break;
    }
    case 'mediaListEnd': {
      eventType = EventType.MediaListEnd;
      eventData = null;
      break;
    }
    default:
      console.log('buildInteractiveTransition - userEvent name: ', userEvent.name);
      userEvent.parameters = null;
      return null;
  }

  let eventIntrinsicAction: EventIntrinsicAction = EventIntrinsicAction.None;

  if (targetIsPreviousState) {
    eventIntrinsicAction = EventIntrinsicAction.ReturnToPriorState;
  }
  else {
    if (isNil(targetMediaState)) {
      switch (remainOnCurrentStateActions) {
        case 'Stop':
          eventIntrinsicAction = EventIntrinsicAction.StopPlayback;
          break;
        case 'StopClear':
          eventIntrinsicAction = EventIntrinsicAction.StopPlaybackAndClearScreen;
          break;
        case 'None':
        default:
          eventIntrinsicAction = EventIntrinsicAction.None;
          break;
      }
    }
  }
  const eventSpecification: DmEventSpecification =
    dmCreateDefaultEventSpecificationForEventType(eventType, eventData, null, eventIntrinsicAction);

  return eventSpecification;
}

function buildInteractiveTransition(
  userEvent: any,
  sourceMediaStateName: string,
  targetMediaStateName: string,
  conditionalTargets: any[],
  brightSignCommands: any[],
  displayMode: string,
  labelLocation: string,
  remainOnCurrentStateActions: any,
  targetIsPreviousState: boolean,
  assignInputToUserVariable: boolean,
  variableToAssign: string,
  assignWildcardToUserVariable: boolean,
  variableToAssignFromWildcard: string) {

  return (dispatch: Function, getState: Function) => {

    const bsdm: DmState = getState().bsdm;
    const sourceMediaState: DmcMediaState = dmGetMediaStateByName(bsdm, { name: sourceMediaStateName });
    const targetMediaState: DmcMediaState = dmGetMediaStateByName(bsdm, { name: targetMediaStateName });

    const eventSpecification: DmEventSpecification = getEventSpecificationFromUserEvent(
      getState().bsdm,
      userEvent,
      targetMediaState,
      remainOnCurrentStateActions,
      targetIsPreviousState,
      assignInputToUserVariable,
      variableToAssign,
      assignWildcardToUserVariable,
      variableToAssignFromWildcard,
    );

    const targetMediaStateId: BsDmId = isObject(targetMediaState) && isString(targetMediaState.id) ?
      targetMediaState.id : BsDmIdNone;

    const thunkAction: BsDmThunkAction<InteractiveAddEventTransitionParams> =
      dmInteractiveAddTransitionForEventSpecification(sourceMediaState.name + '_ev',
        sourceMediaState.id,
        targetMediaStateId,
        eventSpecification);
    const addEventAction = dispatch(thunkAction as any);
    const eventParams = addEventAction.payload;
    const eventId = eventParams.eventId;

    // conditional targets here!!
    // export function dmAddConditionalTransition(
    //    name: string, 
    //    eventId: BsDmId, 
    //    targetMediaStateId: BsDmId, 
    //    condition: DmCondition, 
    //    conditionIndex?: number, 
    //    conditionalAction?: EventIntrinsicAction | null, 
    //    type?: TransitionType, 
    //    duration?: number): 
    // BsDmThunkAction<ConditionalTransitionParams>;

    conditionalTargets.forEach((conditionalTarget: any, index: number) => {

      const compareValue1: DmParameterizedString = convertToParameterizedString(bsdm, conditionalTarget.variableValueSpec);
      // TODO - what if there is no compareValue2?
      const compareValue2: DmParameterizedString = convertToParameterizedString(bsdm, conditionalTarget.variableValue2Spec);

      // TODO - set CompareOperator based on correct value; don't hard code it.
      const condition: DmCondition = dmCreateTransitionCondition(conditionalTarget.variableName, CompareOperator.EQ, compareValue1, compareValue2);

      // TODO - add conditional transition commands using the following...
      // export function dmAddCommand(sequenceType: CommandSequenceType, parentId: BsDmId, command: DmCommand): BsDmThunkAction<CommandAddParams>;

      // TODO - currently a bug in BA Classic where remainOnCurrentStateActions for conditional targets don't support
      //    RemainOnCurrentStateStopPlayback
      //    RemainOnCurrentStateStopPlaybackClearScreen

      const addConditionalTransitionAction: BsDmThunkAction<ConditionalTransitionParams> = dmAddConditionalTransition(
        sourceMediaStateName + "_ct",
        eventId,
        targetMediaStateId, // TODO - could be non existent
        condition,
        index,
        EventIntrinsicAction.None // TODO. Figure out based on remainOnCurrentStateActions
      );

      const conditionalTransitionParams: ConditionalTransitionParams = dispatch(addConditionalTransitionAction).payload;
      const conditionalTransitionId: BsDmId = conditionalTransitionParams.id;

      conditionalTarget.brightSignCommands.forEach((brightSignCommand: any) => {
        const command: DmCommand = buildCommand(bsdm, brightSignCommand);
        dispatch(dmAddCommand(CommandSequenceType.Transition, conditionalTransitionId, command));
      });
    });

    brightSignCommands.forEach((brightSignCommand: any) => {
      const command: DmCommand = buildCommand(bsdm, brightSignCommand);
      const addCommandAction: BsDmThunkAction<CommandAddParams> =
        dmAddCommand(CommandSequenceType.Event, eventId, command);
      dispatch(addCommandAction);
    });

    let transitionDisplayType: TransitionDisplayType = TransitionDisplayType.Automatic;
    if (displayMode === 'displayLabel') {
      transitionDisplayType = TransitionDisplayType.DisplayLabel;
    }
    else if (displayMode === 'displayLine') {
      transitionDisplayType = TransitionDisplayType.DisplayLine;
    }

    let transitionDisplayLabelLocation: TransitionDisplayLabelLocationType;
    if (labelLocation === 'bottom') {
      transitionDisplayLabelLocation = TransitionDisplayLabelLocationType.Bottom;
    }
    else if (labelLocation === 'right') {
      transitionDisplayLabelLocation = TransitionDisplayLabelLocationType.Right;
    }

    // dispatch(baPeUiModelAddInteractiveCanvasEvent({
    //   id: eventId,
    //   displayType: transitionDisplayType,
    //   labelLocation: transitionDisplayLabelLocation,
    // }));
    console.log(getState());
  };
}

// LOOKS OK
function buildNonInteractiveTransitions(eventData: any[]) {
  return (dispatch: Function) => {
    for (let i = 0; i < (eventData.length - 1); i++) {
      dispatch(buildNonInteractiveTransition(eventData[i].mediaStateId, eventData[i + 1].mediaStateId,
        eventData[i].eventSpecification));
    }
    dispatch(buildNonInteractiveTransition(eventData[eventData.length - 1].mediaStateId, eventData[0].mediaStateId,
      eventData[eventData.length - 1].eventSpecification));
  };
}

function buildNonInteractiveTransition(sourceIndex: string, targetIndex: string,
  eventSpecification: DmEventSpecification) {
  return (dispatch: Function, getState: Function) => {
    const bsdm: DmState = getState().bsdm;
    const sourceMediaState: DmcMediaState = dmGetMediaStateById(bsdm, { id: sourceIndex }) as DmcMediaState;
    const targetMediaState: DmcMediaState = dmGetMediaStateById(bsdm, { id: targetIndex }) as DmcMediaState;

    const thunkAction: BsDmThunkAction<InteractiveAddEventTransitionParams> =
      dmInteractiveAddTransitionForEventSpecification(sourceMediaState.name + '_ev',
        sourceMediaState.id,
        targetMediaState.id,
        eventSpecification);
    dispatch(thunkAction as any);
  };
}

function convertToParameterizedNumber(bsdm: DmState, bpfParameterValue: any): DmParameterizedNumber | null {
  const parameterValueItem: any = bpfParameterValue.parameterValueItems[0];
  if (parameterValueItem.type === 'textValue') {
    return {
      type: NumberParameterType.Number,
      value: Number(parameterValueItem.textValue)
    } as DmParameterizedNumber;
  }
  else if (bpfParameterValue.parameterValueItems[0].type === 'userVariable') {
    const userVariableId: BsDmId = dmGetUserVariableIdForName(bsdm,
      { name: parameterValueItem.userVariable.name });
    const userVariable: DmcUserVariable = dmGetUserVariableById(bsdm, { id: userVariableId });
    return {
      type: NumberParameterType.UserVariableName,
      value: parameterValueItem.textValue
    } as DmParameterizedNumber;
  }
  else {
    // TODO - ??
    debugger;
  }
  return null;
}

// TODO - are all parameter value types supported?
function convertToParameterizedString(bsdm: DmState, bpfParameterValue: any): DmParameterizedString {

  let parameterValue: DmParameterizedString = dmGetEmptyParameterizedString();

  bpfParameterValue.parameterValueItems.forEach((parameterValueItem: any) => {
    switch (parameterValueItem.type) {
      case 'textValue': {
        parameterValue = dmAppendStringToParameterizedString(parameterValue, parameterValueItem.textValue);
        break;
      }
      case 'userVariable': {
        const userVariableId: BsDmId = dmGetUserVariableIdForName(bsdm,
          { name: parameterValueItem.userVariable.name });
        const userVariable: DmcUserVariable = dmGetUserVariableById(bsdm, { id: userVariableId });
        parameterValue = dmAppendUserVariableToParameterizedString(parameterValue,
          userVariable.id);
        break;
      }
      default: {
        throw new BpfConverterError(BpfConverterErrorType.unexpectedError,
          'unimplemented parameter value type: ' + parameterValueItem.type);
      }
    }
  });

  return parameterValue;
}

// TODO - review
function addBsnFeed(bsnFeedName: string, baFeedName: string, assetType: AssetType,
  usageType: DataFeedUsageType, bsnDataFeedAssetType: BsnDataFeedAssetType): Function {
  return (dispatch: Function, getState: Function): any => {
    return new Promise((resolve: Function, reject: Function) => {
      fetchBsnFeeds(assetType).then((bsnFeedCollection) => {
        const bsDataFeedAsset: BsAsset = fetchBsDataFeedAsset(bsnFeedCollection, bsnFeedName);

      console.log(getState().bsdm);

      const feedSpec: DmBsnDataFeedSourceSpecification = dmCreateBsnDataFeedSpecification(bsDataFeedAsset.assetItem, usageType);
      const addDataFeedThunkAction: BsDmThunkAction<DataFeedAddParams> = dmAddDataFeed(baFeedName, feedSpec);
      const dataFeedAddParams: DataFeedAddParams = dispatch(addDataFeedThunkAction).payload;

      console.log(getState().bsdm);

      const dmcDataFeed: DmcDataFeed = dmGetDataFeedById(getState().bsdm, { id: dataFeedAddParams.id });

      resolve();
      }).catch((err) => {
        return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'addBsnFeed: ' + err));
      });
    });
  };
}

// TODO - can't add bsn feeds unless logged into BSN
// TODO - hack below to login to my account for further testing purposes.
function addLiveDataFeeds(liveDataFeeds: any[]): Function {

  return (dispatch: Function, getState: Function): Promise<void> => {

    const bsdm: DmState = getState().bsdm;

    return new Promise((resolve, reject) => {

      bsnGetSession().activate('ted@brightsign.biz', 'admin', 'ted-ce').then((mySession: any) => {

        const promises: any[] = [];

        liveDataFeeds.forEach((liveDataFeed: any) => {

          const { autoGenerateUserVariables, dataFeedUse, name, parserPluginName, updateInterval, useHeadRequest,
            userVariableAccess, uvParserPluginName } = liveDataFeed;

          if (!getEnumKeyOfValue(DataFeedUsageType, dataFeedUse)) {
            throw new BpfConverterError(BpfConverterErrorType.errorEnumMatchError, 'DataFeedUsageType: ' + dataFeedUse);
          }

          // TODO - this code is not complete and not all parameters are correct
          // convert parserPluginName to BsDmId and use
          // convert userVariableAccess to AccessType and use
          // etc.

          // find parserPlugin with the name parserPluginName
          let parserBrightScriptPluginId: BsDmId = '';
          if (parserPluginName && typeof parserPluginName === 'string' && parserPluginName !== '') {
            const parserBrightScriptPlugin: DmcParserBrightScriptPlugin =
              dmGetParserPluginByName(bsdm, { name: parserPluginName });
            if (parserBrightScriptPlugin) {
              parserBrightScriptPluginId = parserBrightScriptPlugin.id;
            }
            // TODO
            // If parserPluginScript not found, that means it was a broken link. the liveDataFeed will need to get
            // updated later
          }

          if (liveDataFeed.liveBSNDataFeed) {
            if (!bsnDataFeedCollection) {
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveBSNDataFeed.name, liveDataFeed.name,
                AssetType.BSNDataFeed, dataFeedUse, 'BSNDataFeed')));
            }
            else {
              // TODO - case where it's already been loaded - FIX ME
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveDataFeed.name, liveDataFeed.name,
                AssetType.BSNDataFeed, dataFeedUse, 'BSNDataFeed')));
            }
          }
          else if (liveDataFeed.liveMediaFeed) {
            if (!bsnMediaFeedCollection) {
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveMediaFeed.name, liveDataFeed.name,
                AssetType.BSNMediaFeed, dataFeedUse, 'BSNMediaFeed')));
            }
            else {
              // TODO - case where it's already been loaded
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveMediaFeed.name, liveDataFeed.name,
                AssetType.BSNMediaFeed, dataFeedUse, 'BSNMediaFeed')));
            }
          }
          else if (liveDataFeed.liveBSNTaggedPlaylist) {
            if (!bsnTaggedPlaylistCollection) {
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveBSNTaggedPlaylist.name, liveDataFeed.name,
                AssetType.BSNTaggedPlaylist, dataFeedUse, 'BSNTaggedPlaylist')));
            }
            else {
              // TODO - case where it's already been loaded
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveBSNTaggedPlaylist.name, liveDataFeed.name,
                AssetType.BSNTaggedPlaylist, dataFeedUse, 'BSNTaggedPlaylist')));
            }
          }
          else if (liveDataFeed.liveDynamicPlaylist) {
            if (!bsnDynamicPlaylistCollection) {
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveDynamicPlaylist.name, liveDataFeed.name,
                AssetType.BSNDynamicPlaylist, dataFeedUse, 'BSNDynamicPlaylist')));
            }
            else {
              // TODO - case where it's already been loaded
              promises.push(dispatch(addBsnFeed(liveDataFeed.liveDynamicPlaylist.name, liveDataFeed.name,
                AssetType.BSNDynamicPlaylist, dataFeedUse, 'BSNDynamicPlaylist')));
            }
          }
          // TODO - shouldn't need to be logged in to bsn to convert a url data feed
          else {
            const url: DmParameterizedString = convertToParameterizedString(bsdm, liveDataFeed.url);
            const pvAsString = dmGetDisplayStringFromParameterizedString(bsdm, { paramString: url });

            const feedSpec: DmRemoteDataFeedSourceSpecification = {
              type: 'URLDataFeed',
              url: pvAsString,
              usage: dataFeedUse,
              updateInterval,
              useHeadRequest,
            };
            const dataFeedProperties: DmDataFeedProperties = {
              parserPlugin: parserBrightScriptPluginId,
              autoGenerateUserVariables,
              userVariableAccess: AccessType.Private
            };
            const addDataFeedThunkAction: BsDmThunkAction<DataFeedAddParams> = dmAddDataFeed(name, feedSpec, dataFeedProperties);
            const dataFeedAddParams: DataFeedAddParams = dispatch(addDataFeedThunkAction).payload;
          }
        });

        Promise.all(promises).then(() => {
          resolve();
        }).catch((err) => {
          return reject(new BpfConverterError(BpfConverterErrorType.unexpectedError, 'addLiveDataFeeds: ' + err));
        });

      }).catch((err) => {
        console.log('unable to connect to bsn');
        resolve();
      })
    });
  };
}

// TODO - review
function fetchBsnFeeds(feedType: AssetType): Promise<BsAssetCollection> {
  return new Promise((resolve, reject) => {
    const assetCollection: BsAssetCollection = cmGetBsAssetCollection(AssetLocation.Bsn, feedType);
    assetCollection
      .update()
      .then(() => {
        resolve(assetCollection);
      })
      .catch((err: any) => {
        return reject(new BpfConverterError(BpfConverterErrorType.errorUpdatingAssetCollection, err));
      });
  });
}

// TODO - review
function fetchBsDataFeedAsset(assetCollection: BsAssetCollection, feedName: string): BsAsset {
  const feedAsset: BsAsset = assetCollection.getAsset(feedName);
  // const feedAsset: BsDataFeedAsset = asset as BsDataFeedAsset;
  if (!feedAsset) {
    throw new BpfConverterError(BpfConverterErrorType.errorFetchingBsnFeedProperties, 'fetchBsDataFeedAsset, ' +
      'feedName: ' + feedName);
  }
  return feedAsset;
}

// TODO - I suspect that this is not complete
function addUserVariables(userVariables: any): Function {

  return (dispatch: Function, getState: Function): any => {

    userVariables.forEach((userVariable: any) => {

      const { access, defaultValue, liveDataFeedName, name, networked, systemVariable } = userVariable;

      let dataFeedId: string = '';
      if (liveDataFeedName !== '') {
        const dmcDataFeed: DmcDataFeed = dmGetDataFeedByName(getState().bsdm, { name: liveDataFeedName });
        dataFeedId = dmcDataFeed.id;
      }

      // dmAddUserVariable(name: string, defaultValue: string, access?: AccessType, isNetworked?: boolean,
      // dataFeedId?: BsDmId, systemVariable?: SystemVariableType | null): UserVariableAction;

      // TODO - add all system variables
      let systemVariableType: SystemVariableType;
      switch (systemVariable.toLowerCase()) {
        case 'serialnumber':
          systemVariableType = SystemVariableType.SerialNumber;
          break;
        case 'ipaddresswired':
          systemVariableType = SystemVariableType.IPAddressWired;
          break;
        case 'ipaddresswireless':
          systemVariableType = SystemVariableType.IPAddressWireless;
          break;
        case 'firmwareversion':
          systemVariableType = SystemVariableType.FirmwareVersion;
          break;
        case 'edidmonitorserialnumber':
          systemVariableType = SystemVariableType.EdidMonitorSerialNumber;
          break;
        case 'edidyearofmanufacture':
          systemVariableType = SystemVariableType.EdidYearOfManufacture;
          break;
        case 'edidmonitorname':
          systemVariableType = SystemVariableType.EdidMonitorName;
          break;
        case 'edidmanufacturer':
          systemVariableType = SystemVariableType.EdidManufacturer;
          break;
        case 'edidunspecifiedText':
          systemVariableType = SystemVariableType.EdidUnspecifiedText;
          break;
        case 'edidserialnumber':
          systemVariableType = SystemVariableType.EdidSerialNumber;
          break;
        case 'edidmanufacturerproductCode':
          systemVariableType = SystemVariableType.EdidManufacturerProductCode;
          break;
        case 'edidweekOfmanufacture':
          systemVariableType = SystemVariableType.EdidWeekOfManufacture;
          break;
        case 'activepresentation':
          systemVariableType = SystemVariableType.ActivePresentation;
          break;
        case 'scriptversion':
          systemVariableType = SystemVariableType.ScriptVersion;
          break;
        // TODO - notify user that these are no longer supported
        case 'rfchannelcount':
        case 'rfchannelname':
        case 'rfvirtualchannel':
        case 'tunerscanpercentagecomplete':
          break;
        default: {
          systemVariableType = SystemVariableType.SerialNumber;
          break;
        }
      }

      const userVariableAction: UserVariableAction = dmAddUserVariable(name, defaultValue, access, networked,
        dataFeedId, systemVariable);
      dispatch(userVariableAction);
    });
  };
}

// TODO - PENDING NODE SUPPORT
function addHtmlSites(htmlSites: any[]): Function {

  // TODO - combine code from different site types as appropriate
  return (dispatch: Function, getState: Function): any => {

    const bsdm: DmState = getState().bsdm;

    htmlSites.forEach((htmlSite: any) => {
      if (htmlSite.type === HtmlSiteType.Hosted) {
        const { name, filePath, queryString } = htmlSite;

        let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
        const brokenLink: boolean = isNil(bsAssetItem);
        if (isNil(bsAssetItem)) {
          bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.HtmlSite, name, filePath);
        }
        const htmlSiteLocalThunkAction: BsDmThunkAction<HtmlSiteHostedParams> =
          dmAddHostedHtmlSite(name, bsAssetItem, queryString);
        const actionParams: BsDmAction<HtmlSiteHostedParams> = dispatch(htmlSiteLocalThunkAction);
        const htmlParams: HtmlSiteHostedParams = actionParams.payload;
      }
      else if (htmlSite.type === HtmlSiteType.Remote) {

        const { name, url, queryString } = htmlSite;

        const urlPS: DmParameterizedString = convertToParameterizedString(bsdm, url);
        const queryStringPS: DmParameterizedString = convertToParameterizedString(bsdm, queryString);
        const htmlSiteRemoteAction: HtmlSiteRemoteAction = dmAddRemoteHtmlSite(name, urlPS, queryStringPS);
        dispatch(htmlSiteRemoteAction);
      }
    });
  };
}

// function findScriptPluginBrokenLinks(dmState : DmState, brokenFilePaths:  any[]) {

//   // TODO - not done yet
//   return (dispatch: Function): any => {
//     const scriptPluginIds : BsDmId[] = dmGetScriptPluginIds(dmState);
//     scriptPluginIds.forEach( (scriptPluginId : BsDmId) => {
//       const scriptPlugin: DmBrightScriptPlugin = dmGetScriptPluginStateById(dmState, { id: scriptPluginId });
//       const assetId: BsDmId = scriptPlugin.assetId;
//     });
//   };
// }

// TODO - no known issues
function addScriptPlugins(scriptPlugins: any): Function {

  return (dispatch: Function): any => {
    scriptPlugins.forEach((scriptPlugin: any) => {

      const name = scriptPlugin.name;
      const filePath = scriptPlugin.path;

      let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
      if (!bsAssetItem) {
        bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.BrightScript, path.basename(filePath),
          filePath);
      }

      const addScriptPluginThunkAction: BsDmThunkAction<BrightScriptPluginParams> =
        dmAddBrightScriptPlugin(name, bsAssetItem, false);
      dispatch(addScriptPluginThunkAction);
    });
  };
}

// TODO - no known issues
function addParserPlugins(parserPlugins: any): Function {

  return (dispatch: Function, getState: Function): any => {
    parserPlugins.forEach((parserPlugin: any) => {

      const { name, parseFeedFunctionName, parseUVFunctionName, userAgentFunctionName } = parserPlugin;
      const filePath = parserPlugin.path;

      let bsAssetItem: BsAssetItem = fsGetAssetItemFromFile(filePath);
      if (!bsAssetItem) {
        bsAssetItem = bscAssetItemFromBasicAssetInfo(AssetType.BrightScript, path.basename(filePath),
          filePath);
      }

      const parserPluginThunkAction: BsDmThunkAction<ParserBrightScriptPluginParams> =
        dmAddParserBrightScriptPlugin(name, bsAssetItem, parseFeedFunctionName, parseUVFunctionName,
          userAgentFunctionName, false);
      dispatch(parserPluginThunkAction);
    });
  };
}

// LOOKS OK
function addZones(bpf: any): Function {
  return (dispatch: Function, getState: Function): any => {
    bpf.zones.forEach((bpfZone: any) => {

      const { x, y, width, height } = bpfZone;

      const zoneRect: BsRect = {
        x,
        y,
        width,
        height,
        pct: false
      };
      const zoneAddAction: ZoneAddAction = dispatch(dmAddZone(bpfZone.name, bpfZone.type, bpfZone.id,
        zoneRect, bpfZone.playlist.type !== 'interactive'));
      const zoneAddParams: ZoneAddParams = zoneAddAction.payload;

      const zoneId: BsDmId = zoneAddParams.zone.id;
      const zoneType: ZoneType = zoneAddParams.zone.type;

      dispatch(setZoneProperties(bpfZone, zoneId, zoneType));

      dispatch(buildZonePlaylist(bpfZone, zoneId));
    });
  };
}

// TODO - currently unused - keep around for a while to see if required - 10/12/2018
// function getFileNameFromFilePath(filePath : string) : string {
//   const lastSlash = filePath.lastIndexOf('\\');
//   const brokenLinkFileName = filePath.substr(lastSlash + 1);
//   return brokenLinkFileName;
// }
