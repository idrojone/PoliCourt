import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';

const fixFilenameEncoding = (file: Express.Multer.File): string => {
  return Buffer.from(file.originalname, 'latin1').toString('utf8');
};

export const getMulterOptions = (destinationPath: string) => {
  return {
    storage: diskStorage({
      destination: destinationPath,
      filename: (req, file, callback) => {
        const originalname = fixFilenameEncoding(file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),

    fileFilter: (req: any, file: Express.Multer.File, callback: any) => {
      const originalname = fixFilenameEncoding(file);

      const allowedMimeTypes = [
        'application/pdf', 
        'image/jpeg', 
        'image/png', 
        'image/jpg', 
        'application/octet-stream'
      ];
      const allowedExtensions = /\.(pdf|jpeg|jpg|png)$/i; 

      const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
      const isExtensionValid = allowedExtensions.test(originalname);

      console.log(`Validating file: ${originalname}, MIME type: ${file.mimetype}, isMimeTypeValid: ${isMimeTypeValid}, isExtensionValid: ${isExtensionValid}`);

      if (isMimeTypeValid && isExtensionValid) {
        callback(null, true); // Aceptar archivo
      } else {
        callback(
          new BadRequestException(`El archivo "${originalname}" no es válido. Solo se permiten PDF o Imágenes (JPG, PNG).`),
          false, 
        );
      }
    },

    limits: {
      fileSize: 5 * 1024 * 1024, 
    },
  };
};