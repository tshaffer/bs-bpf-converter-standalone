import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import {
  fixJson,
  getParameterArray,
} from './helpers';

import {
  fixParameterValue,
  fixUserVariable,
  fixUserVariables
} from './bpfToJson';
import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

import {
  fixInteractiveTransition
} from './bpfTransitionsToJson';


import {
  fixInteractiveCommands,
} from './bpfCommandsToJson';

import {
  fixRawUserEvent,
} from './bpfTransitionsToJson';

// TODO - see below
// TODO - perhaps break into separate functions
export function fixInteractiveZonePlaylist(rawZonePlaylist: any) : any {

  const interactiveStates = getParameterArray(rawZonePlaylist.states.state);

  // TODO - if fixInteractiveState can't be null, use map
  const states: any[] = [];
  interactiveStates.forEach ( (state: any) => {
    const interactiveState = fixInteractiveState(state);
    if (!isNil(interactiveState)) {
      states.push(interactiveState);
    }
  });

  const transitions: any[] = [];

  if (isObject(rawZonePlaylist.states.transition)) {
    const rawTransitions: any[] = getParameterArray(rawZonePlaylist.states.transition);
    rawTransitions.forEach ( (transition: any) => {
      transitions.push(fixInteractiveTransition(transition));
    });
  }

  return {
    initialState: rawZonePlaylist.states.initialState,
    states,
    transitions
  };
}

// TODO - see fixInteractiveState
// Parse states for non interactive playlist
export function fixZonePlaylistStates(rawPlaylistItems: any) : any {

  const playlistStates : any[] = [];

  rawPlaylistItems.forEach( (rawPlaylistItem : any) => {
    switch (rawPlaylistItem['#name']) {
      case 'imageItem': {
        playlistStates.push(fixImageItem(rawPlaylistItem));
        break;
      }
      case 'videoItem': {
        playlistStates.push(fixVideoItem(rawPlaylistItem));
        break;
      }
      case 'audioItem': {
        playlistStates.push(fixAudioItem(rawPlaylistItem));
        break;
      }
      case 'html5Item': {
        const html5Item = fixHtml5Item(rawPlaylistItem);
        playlistStates.push(html5Item);
        break;
      }
      case 'liveVideoItem': {
        playlistStates.push(fixLiveVideoItem(rawPlaylistItem));
        break;
      }
      case 'videoStreamItem': {
        playlistStates.push(fixAVStreamItem('videoStreamItem', rawPlaylistItem));
        break;
      }
      case 'mjpegItem': {
        playlistStates.push(fixMjpegStreamItem(rawPlaylistItem));
        break;
      }
      case 'audioStreamItem': {
        playlistStates.push(fixAVStreamItem('audioStreamItem', rawPlaylistItem));
        break;
      }
      case 'mrssDataFeedPlaylistItem': {
        playlistStates.push(fixMrssDataFeedItem(rawPlaylistItem));
        break;
      }
      case 'htmlWidgetItem': {
        playlistStates.push(fixHtmlWidgetItem(rawPlaylistItem));
        break;
      }
    }
  });
  return playlistStates;
}

// TODO - TEST AND CHECK CAREFULLY
// TODO - Twitter
export function fixTickerZonePlaylistStates(rawPlaylistItems: any[]) : any {

  const playlistStates : any[] = [];

  rawPlaylistItems.forEach( (rawPlaylistItem : any) => {
    switch (rawPlaylistItem['#name']) {
      case 'rssDataFeedPlaylistItem':
        playlistStates.push(fixRssDataFeedPlaylistItem(rawPlaylistItem));
        break;
      case 'userVariableInTickerItem':
        playlistStates.push(fixUserVariableInTickerItem(rawPlaylistItem));
        break;
      default:
        break;
    }
  });

  return playlistStates;
}

function fixRssDataFeedPlaylistItem(rawRssDataFeedPlaylistItem: any): any {
  return {
    type: 'rssDataFeedPlaylistItem',
    liveDataFeedName: rawRssDataFeedPlaylistItem.liveDataFeedName 
  };
}

function fixUserVariableInTickerItem(rawUserVariableInTickerItem: any): any {
  return {
    type: 'userVariableInTickerItem',
    liveDataFeedName: rawUserVariableInTickerItem.userVariableName 
  };
}

// export function oldfixTickerZonePlaylistStates(rssDataFeedPlaylistItems: any[]) : any {
//   const rssDataFeedItems : any[] = [];

//   rssDataFeedPlaylistItems.forEach( (rssDataFeedPlaylistItem : any) => {
//     const item : any = {};
//     item.type = 'rssDataFeedPlaylistItem';
//     item.liveDataFeedName = rssDataFeedPlaylistItem.liveDataFeedName;
//     item.isRSSFeed = true;
//     item.isUserVariable = false;

//     rssDataFeedItems.push(item);
//   });

//   return rssDataFeedItems;
// }


// list of playlist items from BrightAuthor not implemented here - which ones need to be added has not yet been determined
//    AudioIn
//    BackgroundImage?
//    InteractiveMenu
//    LocalizedPlaylist
//    RFInputPlaylistItem - not required
//    RFScanPlaylistItem - not required
//    signChannelItem
//    templatePlaylistItem
//    xModemItem
// TODO - the following are present for non interactive but I don't see them here
//    videoStreamItem
//    mjpegItem
//    audioStreamItem
export function fixInteractiveState(rawInteractiveState: any): any {

  let interactiveState: any;

  if (isObject(rawInteractiveState.imageItem)) {
    interactiveState = fixImageItem(rawInteractiveState.imageItem);
  }
  else if (isObject(rawInteractiveState.videoItem)) {
    interactiveState = fixVideoItem(rawInteractiveState.videoItem);
  }
  else if (isObject(rawInteractiveState.audioItem)) {
    interactiveState = fixAudioItem(rawInteractiveState.audioItem);
  }
  else if (isObject(rawInteractiveState.html5Item)) {
    interactiveState = fixHtml5Item(rawInteractiveState.html5Item);
  }
  else if (isObject(rawInteractiveState.liveVideoItem)) {
    interactiveState = fixLiveVideoItem(rawInteractiveState.liveVideoItem);
  }
  else if (isObject(rawInteractiveState.mrssDataFeedPlaylistItem)) {
    interactiveState = fixMrssDataFeedItem(rawInteractiveState.mrssDataFeedPlaylistItem);
  }
  else if (isObject(rawInteractiveState.mediaListItem)) {
    interactiveState = fixMediaListItem(rawInteractiveState.mediaListItem);
  }
  else if (isObject(rawInteractiveState.eventHandler2Item)) {
    interactiveState = fixEventHandlerItem(rawInteractiveState.eventHandler2Item);
  }
  else if (isObject(rawInteractiveState.superStateItem)) {
    interactiveState = fixSuperStateItem(rawInteractiveState.superStateItem);
  }
  else if (isObject(rawInteractiveState.playFileItem)) {
    interactiveState = fixPlayFileItem(rawInteractiveState.playFileItem);
  }
  else if (isObject(rawInteractiveState.mjpegItem)) {
    interactiveState =   fixMjpegStreamItem(rawInteractiveState.mjpegItem);
  }
  // TODO - streams
  else {
    // TODO
    debugger;
  }

  interactiveState.id = rawInteractiveState.id;
  interactiveState.name = rawInteractiveState.name;
  interactiveState.x = Number(rawInteractiveState.x);
  interactiveState.y = Number(rawInteractiveState.y);
  interactiveState.width = Number(rawInteractiveState.width);
  interactiveState.height = Number(rawInteractiveState.height);

  interactiveState.brightSignEntryCommands = [];
  if (isArray(rawInteractiveState.brightSignCmd)) {
    interactiveState.brightSignEntryCommands = fixInteractiveCommands(rawInteractiveState.brightSignCmd);
  }

  interactiveState.brightSignExitCommands = [];
  if (isObject(rawInteractiveState.brightSignExitCommands) &&
    isArray(rawInteractiveState.brightSignExitCommands.brightSignCmd)) {
    interactiveState.brightSignExitCommands =
      fixInteractiveCommands(rawInteractiveState.brightSignExitCommands.brightSignCmd);
  }

  return interactiveState;
}

// LOOKS OK
// useImageBuffer - required, at least to flag to user?
function fixImageItem(rawImageItem : any) : any {

  const imageItemParametersSpec: any[] = [
    { name: 'fileIsLocal', type: 'boolean'},
    { name: 'slideDelayInterval', type: 'number'},
    { name: 'slideTransition', type: 'string'},
    { name: 'transitionDuration', type: 'number'},
    { name: 'videoPlayerRequired', type: 'boolean'},
  ];

  const imageItem : any = fixJson(imageItemParametersSpec, rawImageItem);
  imageItem.file = fixRawFileItem(rawImageItem.file.$);
  imageItem.type = 'imageItem';

  return imageItem;
}

// LOOKS OK
// TODO - videoDisplayMode - required, at least to flag to user?
function fixVideoItem(rawVideoItem : any) : any {
  
  const videoItemParametersSpec: any[] = [
    { name: 'automaticallyLoop', type: 'boolean'},
    { name: 'fileIsLocal', type: 'boolean'},
    { name: 'videoDisplayMode', type: 'string'},
    { name: 'volume', type: 'number'},
  ];

  const videoItem : any = fixJson(videoItemParametersSpec, rawVideoItem);
  videoItem.file = fixRawFileItem(rawVideoItem.file.$);
  videoItem.type = 'videoItem';

  return videoItem;
}

// LOOKS OK
function fixAudioItem(rawAudioItem: any) : any {

  const audioItemParametersSpec: any[] = [
    { name: 'fileIsLocal', type: 'boolean'},
    { name: 'volume', type: 'number'},
  ];

  const audioItem : any = fixJson(audioItemParametersSpec, rawAudioItem);
  audioItem.file = fixRawFileItem(rawAudioItem.file.$);
  audioItem.type = 'audioItem';

  return audioItem;
}

// LOOKS OK
function fixMediaListItem(rawMediaListItem: any) : any {
  const mediaListParametersSpec: any[] = [
    { name: 'mediaType', type: 'string'},
    { name: 'advanceOnMediaEnd', type: 'boolean'},
    { name: 'advanceOnImageTimeout', type: 'boolean'},
    { name: 'playFromBeginning', type: 'boolean'},
    { name: 'imageTimeout', type: 'number'},
    { name: 'support4KImages', type: 'boolean'},
    { name: 'shuffle', type: 'boolean'},
    { name: 'slideTransition', type: 'string'},
    { name: 'sendZoneMessage', type: 'boolean'},
    { name: 'startIndex', type: 'number'},
    { name: 'transitionDuration', type: 'number'},
    { name: 'populateFromMediaLibrary', type: 'boolean'},
    { name: 'liveDataFeedName', type: 'string'},
  ];

  const mediaListItem : any = fixJson(mediaListParametersSpec, rawMediaListItem);
  mediaListItem.nextEvent = fixMediaListTransition(rawMediaListItem.next);
  mediaListItem.previousEvent = fixMediaListTransition(rawMediaListItem.previous);
  mediaListItem.files = fixMediaListFiles(rawMediaListItem.files);
  
  mediaListItem.nextTransitionCommand = {};
  if (isObject(rawMediaListItem.brightSignCmdsTransitionNextItem)) {
    mediaListItem.nextTransitionCommands =
      fixMediaListTransitionCommand(rawMediaListItem.brightSignCmdsTransitionNextItem);
  }

  mediaListItem.previousTransitionCommand = {};
  if (isObject(rawMediaListItem.brightSignCmdsTransitionPreviousItem)) {
    mediaListItem.previousTransitionCommands =
      fixMediaListTransitionCommand(rawMediaListItem.brightSignCmdsTransitionPreviousItem);
  }

  mediaListItem.type = 'mediaListItem';

  return mediaListItem;
}

// REQUIRES FURTHER VERIFICATION
function fixMediaListTransition(rawMediaListTransition: any) {

  let mediaListTransitionEvent = {};
  if (isObject(rawMediaListTransition)) {
    mediaListTransitionEvent = fixRawUserEvent(rawMediaListTransition.userEvent);
  }
  return mediaListTransitionEvent;
}

// REQUIRES FURTHER VERIFICATION
function fixMediaListFiles(rawMediaListFiles: any): any[] {
  const mediaListFiles: any[] = [];
  const rawFiles: any[] = getParameterArray(rawMediaListFiles.$$);
  rawFiles.forEach( (rawMediaListFile: any) => {
    mediaListFiles.push(fixMediaListFile(rawMediaListFile));
  });
  return mediaListFiles;
}

// TODO - other media list file types. Further investigation required to get list of all supported media types
function fixMediaListFile(rawMediaListFile: any) {
  const index = '#name';
  switch (rawMediaListFile[index]) {
    case 'imageItem':
      return fixImageItem(rawMediaListFile);
    case 'videoItem':
      return fixVideoItem(rawMediaListFile);
    case 'audioItem':
      return fixAudioItem(rawMediaListFile);
    default:
      return {};
  }
}

// REQUIRES FURTHER VERIFICATION
function fixMediaListTransitionCommand(rawMediaListTransitionCommand: any) {
  let transitionCommand: any;
  if (isObject(rawMediaListTransitionCommand.brightSignCmd)) {
    transitionCommand = fixInteractiveCommands(rawMediaListTransitionCommand.brightSignCmd);
  }
  return transitionCommand;
}

// LOOKS OK
function fixEventHandlerItem(rawEventHandlerItem: any) : any {
  const eventHandlerParametersSpec: any[] = [
    { name: 'stopPlayback', type: 'boolean'},
  ];

  const eventHandlerItem: any = fixJson(eventHandlerParametersSpec, rawEventHandlerItem);
  eventHandlerItem.type = 'eventHandlerItem';

  return eventHandlerItem;
}

// TODO - default media not implemented
function fixPlayFileItem(rawPlayFileItem: any) : any {
  const playFileParametersSpec: any[] = [
    { name: 'mediaType', type: 'string' },
    { name: 'stateName', type: 'string' },
    { name: 'slideTransition', type: 'string' },
    { name: 'specifyLocalFiles', type: 'boolean' },
    { name: 'useDefaultMedia', type: 'boolean' },
    { name: 'useUserVariable', type: 'boolean' },
    { name: 'liveDataFeedName', type: 'string' },
    { name: 'defaultMediaFileName', type: 'string' },
    { name: 'defaultMediaFileNameSuffix', type: 'string' },
    { name: 'defaultMediaFilePath', type: 'string' },
  ];

  const playFileItem: any = fixJson(playFileParametersSpec, rawPlayFileItem);
  if (playFileItem.useUserVariable) {
    playFileItem.userVariable = fixUserVariable(rawPlayFileItem.userVariable);
  }
  if (!isNil(rawPlayFileItem.filesTable)) {
    playFileItem.filesTable = fixPlayFileFilesTable(rawPlayFileItem.filesTable);
  }
  playFileItem.type = 'playFileItem';

  return playFileItem;
}

// LOOKS OK
function fixPlayFileFilesTable(rawPlayFileFilesTable: any) : any {
  const files: any[] = [];
  rawPlayFileFilesTable.file.forEach( (rawFile: any) => {
    files.push(fixPlayFileFile(rawFile));
  });
  return files;
}

// LOOKS OK
// videoDisplayMode - same question as above
function fixPlayFileFile(rawFile: any): any {
  const playFileParametersSpec: any[] = [
    { name: 'key', type: 'string'},
    { name: 'label', type: 'string'},
    { name: 'export', type: 'boolean'},
    { name: 'path', type: 'string'},
    { name: 'name', type: 'string'},
    { name: 'suffix', type: 'string'},
    { name: 'videoDisplayMode', type: 'string'},
    { name: 'type', type: 'string'},
  ];
  return fixJson(playFileParametersSpec, rawFile.$);
}

// LOOKS OK
function fixSuperStateItem(rawSuperStateItem: any) : any {
  const superStateParametersSpec: any[] = [
    { name: 'stateName', type: 'string'},
    { name: 'initialState', type: 'string'},
  ];

  const superStateItem: any = fixJson(superStateParametersSpec, rawSuperStateItem);
  superStateItem.type = 'superStateItem';
  superStateItem.states = [];

  if (isArray(rawSuperStateItem.state)) {
    rawSuperStateItem.state.forEach( (subState: any) => {
      const childState = fixInteractiveState(subState);
      if (!isNil(childState)) {
        superStateItem.states.push(childState);
      }
    });
  }

  return superStateItem;
}

// LOOKS OK
function fixLiveVideoItem(rawLiveVideoItem: any) : any {

  const liveVideoParametersSpec: any[] = [

    { name: 'volume', type: 'number'},
    { name: 'timeOnScreen', type: 'number'},
    { name: 'overscan', type: 'boolean'}
  ];

  const liveVideoItem: any = fixJson(liveVideoParametersSpec, rawLiveVideoItem);
  liveVideoItem.type = 'liveVideoItem';

  return liveVideoItem;
}

function fixMjpegStreamItem(rawMjpegStreamItem: any) : any {

  const name: string = rawMjpegStreamItem.mjpegSpec.$.name;
  const timeOnScreen: number = Number(rawMjpegStreamItem.mjpegSpec.$.timeOnScreen);
  const rotation: number = Number(rawMjpegStreamItem.mjpegSpec.$.rotation);
  const url : any = fixParameterValue(rawMjpegStreamItem.url.parameterValue);

  const mjpegStreamItem: any = {
    name,
    timeOnScreen,
    rotation,
    url
  };
  mjpegStreamItem.type = 'mjpegStreamItem';

  return mjpegStreamItem;
}

// LOOKS OK
function fixMrssDataFeedItem(rawMrssDataFeedItem : any) : any {

  const mrssDataFeedItemParametersSpec: any[] = [
    { name: 'stateName', type: 'string'},
    { name: 'liveDataFeedName', type: 'string'},
    { name: 'usesBSNDynamicPlaylist', type: 'boolean'},
    { name: 'videoPlayerRequired', type: 'boolean'},
  ];

  const mrssDataFeedItem: any = fixJson(mrssDataFeedItemParametersSpec, rawMrssDataFeedItem);
  mrssDataFeedItem.type = 'mrssDataFeedItem';

  return mrssDataFeedItem;
}

// TODO - pending node support
function fixHtml5Item(rawHtml5Item : any) : any {

  const html5ItemSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'htmlSiteName', type: 'string'},
    { name: 'enableExternalData', type: 'boolean'},
    { name: 'enableMouseEvents', type: 'boolean'},
    { name: 'displayCursor', type: 'boolean'},
    { name: 'hwzOn', type: 'boolean'},
    { name: 'useUserStylesheet', type: 'boolean'},
    { name: 'timeOnScreen', type: 'number'},
  ];

  const html5Item: any = fixJson(html5ItemSpec, rawHtml5Item);
  html5Item.type = 'html5Item';
  html5Item.userStyleSheet = ''; // TODO

  return html5Item;
}

// TODO - add suffix?
function fixRawFileItem(rawFileItem : any) : any {
  const fileItemParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'path', type: 'string'},
  ];

  return fixJson(fileItemParametersSpec, rawFileItem);
}

// LOOKS OK
function fixAVStreamItem(streamType: string, rawAVStreamItem: any) : any {

  const name: string = rawAVStreamItem.streamSpec.$.name;
  const timeOnScreen: number = Number(rawAVStreamItem.streamSpec.$.timeOnScreen);

  const url : any = fixParameterValue(rawAVStreamItem.url.parameterValue);

  const avStreamItem: any = {
    name,
    timeOnScreen,
    url
  };
  avStreamItem.type = streamType;

  return avStreamItem;
}

// TODO - Is this really used? I don't think so.
function fixHtmlWidgetItem(rawHtmlWidgetItem : any) : any {

  const htmlWidgetItemSpec : any[] = [
    { name: 'name', type: 'string' },
    { name: 'componentPath', type: 'string' },
  ];

  const htmlWidgetItem : any = fixJson(htmlWidgetItemSpec, rawHtmlWidgetItem);

  const htmlWidgetItemProperties : any[] = [];
  const rawHtmlWidgetItemProperties = getParameterArray(rawHtmlWidgetItem.properties.property);
  rawHtmlWidgetItemProperties.forEach( (property : any) => {
    const htmlWidgetItemProperty : any = fixHtmlWidgetItemProperty(property);
    if (htmlWidgetItemProperty) {
      htmlWidgetItemProperties.push(htmlWidgetItemProperty);
    }
  });

  htmlWidgetItem.properties = htmlWidgetItemProperties;
  htmlWidgetItem.reactComponent = htmlWidgetItem.componentPath;
  htmlWidgetItem.type = 'htmlWidgetItem';
  return htmlWidgetItem;
}

// TODO - Is this really used? I don't think so.
function fixHtmlWidgetItemProperty(rawHtmlWidgetItemProperty : any) : any {

  let htmlWidgetItemProperty : any = null;

  if (rawHtmlWidgetItemProperty.value && typeof rawHtmlWidgetItemProperty.value === 'string' &&
    rawHtmlWidgetItemProperty.value.length > 0) {
    const htmlWidgetItemSpecProperty : any[] = [
      { name: 'name', type: 'string' },
      { name: 'type', type: 'string' },
      { name: 'value', type: 'string' },
    ];

    htmlWidgetItemProperty = fixJson(htmlWidgetItemSpecProperty, rawHtmlWidgetItemProperty);
  }

  return htmlWidgetItemProperty;
}

