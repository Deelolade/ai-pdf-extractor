export const chunkText = (text: string, chunkSize:number = 500): string[] =>{
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks: string[] = [];
    let currentChunk = "";

    for( const sentence of sentences){
        if((currentChunk + sentence).length > chunkSize){
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else{
            currentChunk += " " + sentence;
        }
    }
    if(currentChunk){
        chunks.push(currentChunk.trim());
    }
    return chunks;
}