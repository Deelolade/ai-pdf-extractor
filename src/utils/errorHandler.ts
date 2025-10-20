export const errorHandler =(status:number, message:string)=>{
    const err:any = new Error(message);
    err.status = status;
    return err;
}