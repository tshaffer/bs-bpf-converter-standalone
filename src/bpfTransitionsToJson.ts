import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import {
  fixJson,
  getParameterArray,
} from './helpers';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

import {
  fixParameterValue
} from './bpfToJson';

import {
  fixBrightSignCommand,
  fixInteractiveCommands,
} from './bpfCommandsToJson';

export function fixInteractiveTransition(rawTransition: any): any {

  const transitionParametersSpec: any[] = [
    { name: 'assignInputToUserVariable', type: 'boolean'},
    { name: 'userVariableToAssignInput', type: 'string'},
    { name: 'assignWildcardToUserVariable', type: 'boolean'},
    { name: 'userVariableToAssignWildcard', type: 'string'},
    { name: 'displayMode', type: 'string'},
    { name: 'labelLocation', type: 'string'},
    { name: 'remainOnCurrentStateActions', type: 'string'},
    { name: 'targetIsPreviousState', type: 'string'},
    { name: 'sourceMediaState', type: 'string'},
    { name: 'targetMediaState', type: 'string'},
  ];

  const transition : any = fixJson(transitionParametersSpec, rawTransition);

  const rawConditionalTargets: any[] = getParameterArray(rawTransition.conditionalTarget);
  transition.conditionalTargets = fixConditionalTargets(rawConditionalTargets);
  
  transition.userEvent = fixRawUserEvent(rawTransition.userEvent);

  if (isObject(rawTransition.brightSignCmd)) {
    const brightSignCmds: any[] = getParameterArray(rawTransition.brightSignCmd);
    transition.brightSignCommands = brightSignCmds.map( (brightSignCmd) => {
      return fixBrightSignCommand(rawTransition.brightSignCmd);
    })
  }
  else {
    transition.brightSignCommands = [];
  }
  return transition;
}

function fixConditionalTargets(rawConditionalTargets: any[]) {

  const parametersSpec: any[] = [
    { name: 'variableName', type: 'string'},
    { name: 'variableType', type: 'string'},
    { name: 'operator', type: 'string'},
    { name: 'targetMediaState', type: 'string'},
    { name: 'targetIsPreviousState', type: 'string' },
    { name: 'remainOnCurrentStateActions', type: 'string'},
  ];

  const conditionalTargets: any[] = rawConditionalTargets.map( (rawConditionalTarget: any) => {
    const conditionalTarget: any = fixJson(parametersSpec, rawConditionalTarget);
    conditionalTarget.variableValueSpec = fixParameterValue(rawConditionalTarget.variableValueSpec.parameterValue);
    conditionalTarget.variableValue2Spec = fixParameterValue(rawConditionalTarget.variableValue2Spec.parameterValue);
    const brightSignCmds: any[] = getParameterArray(rawConditionalTarget.brightSignCmd);
    conditionalTarget.brightSignCommands = brightSignCmds.map( (brightSignCmd: any) => {
      return fixBrightSignCommand(brightSignCmd);
    })

    return conditionalTarget;
  });

  return conditionalTargets;
}

// LOOKS OK
function fixTimeoutParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'number'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// TODO - support pressContinuous
function fixGpioUserEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'buttonNumber', type: 'number'},
    { name: 'buttonDirection', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  parameters.pressContinuous = fixRawPress(rawParameters);
  return parameters;
}

// LOOKS OK
function fixRectangularTouchEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'x', type: 'number'},
    { name: 'y', type: 'number'},
    { name: 'width', type: 'number'},
    { name: 'height', type: 'number'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixMediaEndEventParameters(rawParameters: any) : any {
  return [];
}

// LOOKS OK
function fixSynchronizeEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixUdpEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
    { name: 'label', type: 'string'},
    { name: 'export', type: 'boolean'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// TODO - the following comment appears in SimpleUserEvent.cs
// convert Port from USB Friendly Id to BA USB Id as needed
// TODO - when is parameter used? I think parameter2 is used.
function fixSerialEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'number'},
    { name: 'parameter2', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixKeyboardEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
// TODO - combine simpleParameters into a single function?
function fixUsbEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// TODO - only a single type of time clock events has been implemented
// see TimeClockEvent.cs
function fixTimeClockEventEventParameters(rawParameters: any) : any {
  // TBD
  const parametersSpec: any[] = [
  ];
  const parameters = fixTimeClockDateTime(rawParameters.timeClockDateTime);
  parameters.type = 'timeClockDateTime';
  return parameters;
}

// LOOKS OK
function fixTimeClockDateTime(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'dateTime', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixZoneMessageEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixRemoteEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'parameter', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// LOOKS OK
function fixPluginMessageEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'message', type: 'string'},
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  return parameters;
}

// TODO - is timedBrightSignCmd.brightSignCmd ever an array? or timedBrightSignCmd.brightSignCmd.command? SetAudio?
// TODO - review thoroughly
function fixTimedBrightSignCmdParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'timeout', type: 'number'},
  ];
  let brightSignCmd: any = {};
  const timedBrightSignCmds: any[] = [];
  if (isArray(rawParameters)) {
    rawParameters.forEach( (timedBrightSignCmd: any) => {
      brightSignCmd = {};
      brightSignCmd.timeout = fixJson(parametersSpec, timedBrightSignCmd);
      brightSignCmd.command = fixBrightSignCommand(timedBrightSignCmd.brightSignCmd);
      timedBrightSignCmds.push(brightSignCmd);
    });
  }
  else {
    brightSignCmd.timeout = fixJson(parametersSpec, rawParameters);
    brightSignCmd.command = fixBrightSignCommand(rawParameters.brightSignCmd);
    timedBrightSignCmds.push(brightSignCmd);
  }
  return timedBrightSignCmds;
}

// LOOKS OK
function fixAudioTimeCodeEventParameters(rawParameters: any) : any {
  const parameters = fixTimedBrightSignCmdParameters(rawParameters.timedBrightSignCmd);
  return parameters;
}

// LOOKS OK
function fixVideoTimeCodeEventParameters(rawParameters: any) : any {
  const parameters = fixTimedBrightSignCmdParameters(rawParameters.timedBrightSignCmd);
  return parameters;
}

// LOOKS OK
function fixGpsEventParameters(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'enterRegion', type: 'boolean'}
  ];
  const parameters = fixJson(parametersSpec, rawParameters);
  parameters.gpsRegion = fixGpsRegion(rawParameters.gpsRegion);
  return parameters;
}

// LOOKS OK
function fixGpsRegion(rawParameters: any) : any {
  const parametersSpec: any[] = [
    { name: 'radius', type: 'number'},
    { name: 'radiusUnitsInMiles', type: 'boolean'},
    { name: 'latitude', type: 'number'},
    { name: 'longitude', type: 'number'},
  ];
  return fixJson(parametersSpec, rawParameters);
}

// LOOKS OK
function fixMediaListEndEventParameters(rawParameters: any) : any {
  return [];
}

// LOOKS OK
function fixRawBpUserEventParameters(rawBpUserEventParameters: any): any {
  const bpUserEventParametersSpec: any[] = [
    { name: 'buttonNumber', type: 'number'},
    { name: 'buttonPanelIndex', type: 'number'},
    { name: 'buttonPanelType', type: 'string'},
  ];
  const bpUserEventParameters = fixJson(bpUserEventParametersSpec, rawBpUserEventParameters);
  bpUserEventParameters.pressContinuous = fixRawPress(rawBpUserEventParameters);
  return bpUserEventParameters;
}

// LOOKS OK
function fixRawPress(rawBpUserEventParameters: any) : any {
  if (!isNil(rawBpUserEventParameters.pressContinuous)) {
    return fixRawPressContinuous(rawBpUserEventParameters.pressContinuous);
  }
  else {
    return null;
  }
}

// LOOKS OK
function fixRawPressContinuous(rawPressContinuous: any) : any {
  const rawPressContinuousParametersSpec: any[] = [
    { name: 'repeatInterval', type: 'number'},
    { name: 'initialHoldoff', type: 'number'},
  ];
  return fixJson(rawPressContinuousParametersSpec, rawPressContinuous);
}


// TODO - all types of user events?
// user events in BA not supported here
//    internalSynchronize
//    quietUserEvent
//    loudUserEvent
//    success
//    fail
//    auxConnectUserEvent
//    bp900UserEvent
//    interactiveMenuEnterEvent
export function fixRawUserEvent(rawUserEvent: any): any {

  const userEvent: any = {};

  if (isObject(rawUserEvent)) {
    userEvent.name = rawUserEvent.name;
    switch (userEvent.name) {
      // TODO - other bp types
      case 'bp900AUserEvent':
        userEvent.parameters = fixRawBpUserEventParameters(rawUserEvent.parameters);
        break;
      case 'timeout':
        userEvent.parameters = fixTimeoutParameters(rawUserEvent.parameters);
        break;
      case 'gpioUserEvent':
        userEvent.parameters = fixGpioUserEventParameters(rawUserEvent.parameters);
        break;
      case 'rectangularTouchEvent':
        userEvent.parameters = fixRectangularTouchEventParameters(rawUserEvent.parameters);
        break;
      case 'mediaEnd':
        userEvent.parameters = fixMediaEndEventParameters(rawUserEvent.parameters);
        break;
      case 'synchronize':
        userEvent.parameters = fixSynchronizeEventParameters(rawUserEvent.parameters);
        break;
      case 'udp':
        userEvent.parameters = fixUdpEventParameters(rawUserEvent.parameters);
        break;
      case 'serial':
        userEvent.parameters = fixSerialEventParameters(rawUserEvent.parameters);
        break;
      case 'keyboard':
        userEvent.parameters = fixKeyboardEventParameters(rawUserEvent.parameters);
        break;
      case 'usb':
        userEvent.parameters = fixUsbEventParameters(rawUserEvent.parameters);
        break;
      case 'timeClockEvent':
        userEvent.parameters = fixTimeClockEventEventParameters(rawUserEvent.timeClockEvent);
        break;
      case 'zoneMessage':
        userEvent.parameters = fixZoneMessageEventParameters(rawUserEvent.parameters);
        break;
      case 'remote':
        userEvent.parameters = fixRemoteEventParameters(rawUserEvent.parameters);
        break;
      case 'pluginMessageEvent':
        userEvent.parameters = fixPluginMessageEventParameters(rawUserEvent.parameters);
        break;
      case 'videoTimeCodeEvent':
        userEvent.parameters = fixVideoTimeCodeEventParameters(rawUserEvent.parameters);
        break;
      case 'gpsEvent':
        userEvent.parameters = fixGpsEventParameters(rawUserEvent.parameters);
        break;
      case 'audioTimeCodeEvent':
        userEvent.parameters = fixAudioTimeCodeEventParameters(rawUserEvent.parameters);
        break;
      case 'mediaListEnd':
        userEvent.parameters = fixMediaListEndEventParameters(rawUserEvent.parameters);
        break;
    }
  }

  return userEvent;
}

