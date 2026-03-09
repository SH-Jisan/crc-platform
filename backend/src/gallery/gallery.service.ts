import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GalleryService {

    constructor(private prisma:PrismaService){}

    async upload(image_url:string,caption:string,userId:string){

        return this.prisma.gallery.create({

            data:{
                image_url,
                caption,
                uploaded_by:userId
            }

        })

    }

    getAll(){

        return this.prisma.gallery.findMany({
            include:{uploader:true}
        })

    }

}