import { isArray, isNil, isNumber, isObject, isString } from 'lodash';

import {
  fixJson,
  getParameterArray,
} from './helpers';

import {
  fixParameterValue
} from './bpfToJson';

import {
  BpfConverterError,
  BpfConverterErrorType
} from './error';

// LOOKS OK
export function fixInteractiveCommands(brightSignCommands: any): any {
  const brightSignCmds: any[] = [];
  brightSignCommands.forEach( (brightSignCommand: any) => {
    const brightSignCmd = fixBrightSignCommand(brightSignCommand);
    brightSignCmds.push(brightSignCmd);
  });

  return brightSignCmds;
}

// LOOKS OK
export function fixBrightSignCommand(brightSignCommand: any): any {
  const commandParametersSpec: any[] = [
    { name: 'name', type: 'string'},
    { name: 'customUI', type: 'boolean'},
  ];
  const brightSignCmd : any = fixJson(commandParametersSpec, brightSignCommand);
  brightSignCmd.command = fixBrightSignCmdCommand(brightSignCommand.command);
  return brightSignCmd;
}

// TODO - pull out parameter fixing into separate function
function fixBrightSignCmdCommand(bsCommand: any): any {
  const commandParametersSpec: any[] = [
    { name: 'name', type: 'string'},
  ];

  const command: any = fixJson(commandParametersSpec, bsCommand);

  if (isObject(bsCommand.parameter)) {
    const commandParameters: any[] = getParameterArray(bsCommand.parameter);
    command.parameters = commandParameters.map( (commandParameter: any) => {
      return fixBrightSignCmdParameter(commandParameter);
    })
  }

  return command;
}

// LOOKS OK
// but requires more testing
function fixBrightSignCmdParameter(bsCommandParameter: any): any {
  const parameterParametersSpec: any[] = [
    { name: 'name', type: 'string'},
  ];
  const parameter: any = fixJson(parameterParametersSpec, bsCommandParameter);
  if (isObject(bsCommandParameter.parameterValue)) {
    parameter.parameterValue = fixParameterValue(bsCommandParameter.parameterValue);
  }
  return parameter;
}

