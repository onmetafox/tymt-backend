import { 
    Injectable, 
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    InternalServerErrorException 
} from "@nestjs/common";
import { MongoError } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from "mongoose";
import { IResponseDto } from "./base.interface";
import { BaseWhereDto } from "./base-where.dto";
@Injectable()
@Catch(MongoError)
export class BaseService <T> implements ExceptionFilter { catch(exception: typeof MongoError, host: ArgumentsHost) {}
    
    constructor(@InjectModel('model') private model: Model<T>) {}
    
    PAGE: number = 1;
    PAGE_SIZE: number = 20;
    WHERE: BaseWhereDto;

    /**
     * Creates a new document in the database.
     *
     * @param {Partial<T>} data - The data to be used to create the document.
     * @return {Promise<T>} The newly created document.
     */
    async create(data: Partial<T>): Promise<any> {
        try {
            const doc = await new this.model(data);
            return doc.save();
            
        } catch (e) {
            throw new InternalServerErrorException(
                'Error occurred while fetching data from MongoDB.',
                e,
            );
        }
    }
    /**
     * Updates a document in the database with the given id and data.
     *
     * @param {string} id - The id of the document to update.
     * @param {Partial<T>} data - The data to update the document with.
     * @return {Promise<T | null>} A promise that resolves to the updated document, or null if not found.
     */
    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }

    /**
     * Finds a single record by its id.
     *
     * @param {string} id - The id of the record to find.
     * @return {Promise<IResponseDto<T> | null>} A promise that resolves to the found record or null.
     */
    async findOne(id: string): Promise<IResponseDto<T> | null> {
        const result = await this.model.findById(id).exec();
        if (result) {
        // if we want to keep the result as find all as array
            const dataArray: T[] = [result]; // Convert the result to an array
            return {
                data: result,
                msg: 'SUCCESS',
            };
        } else {
            return {
                msg: 'SUCCESS',
            };
        }
    }

    /**
     * Find all records that match the given conditions.
     *
     * @param {WhereDto} where - The conditions to match.
     * @return {Promise<IResponseDto<T>>} A promise that resolves to the response DTO.
     */
    async findAll(where: BaseWhereDto): Promise<IResponseDto<T>> {

        this.PAGE = where.page;
        this.WHERE = where;

        delete where.page;
        
        const objectsCount = await this.model.countDocuments(where).exec();
        const pageCount = Math.ceil(objectsCount / this.PAGE_SIZE);
        const data = await this.model
        .find(where)
        .skip((this.PAGE - 1) * this.PAGE_SIZE)
        .limit(this.PAGE_SIZE);

        const pagination = {
            page: this.PAGE,
            pageSize: this.PAGE_SIZE,
            pageCount: pageCount,
            total: objectsCount,
        };

        return {
            data: data,
            meta: {
                pagination: pagination,
            },
        };
    }
    /**
     * Removes a document from the model by its ID.
     *
     * @param {string} id - The ID of the document to remove.
     * @return {Promise<T | null>} A promise that resolves to the removed document,
     * or null if no document was found with the given ID.
     */
    async remove(id: string): Promise<T | null> {
        return this.model.findByIdAndDelete(id).exec();
    }
}