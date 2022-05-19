import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { NEST_APP } from '../../../main';

@Injectable()
export class FilesService {
  findAll = async (): Promise<any[]> => {
    const getFileUrl = await NEST_APP.getUrl();
    console.log(getFileUrl);
    return fs.readdirSync('public').map((file) => {
      return {
        name: file,
        url: getFileUrl + '/public/' + file,
      };
    });
  };
}
