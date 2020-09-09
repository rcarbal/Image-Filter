import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { fileURLToPath } from 'url';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /** @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  GET /filteredimage?image_url={{URL}}
  endpoint to filter an image from a public url.
  QUERY PARAMATERS
     image_url: URL of a publicly accessible image
  RETURNS
    the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]
  IT SHOULD
     1
  **/


  app.get('/filteredimage', async (req, res) =>{
    let { image_url } = req.query;

    let list: string[] = [];

    //    1. validate the image_url query
    if (!image_url){
      return res.status(400).send('URL param is required.')
    }
    //    2. call filterImageFromURL(image_url) to filter the image
    let image = await filterImageFromURL(image_url);
    list.push(image)   
   
    //    3. send the resulting file in the response
   new Promise(()=>{
      res.status(200).sendFile(image, (err) =>{
        if(err){
          // next(new Error('Error sending File!'));
          console.log("error")
        } else {
          console.log('file sent!');

          //    4. deletes any files on the server on finish of the response
          deleteLocalFiles(list)
          console.log("Deleted Files")
          console.log("Ready for production.")
        }
      })

    })




  /**************************************************************************** */

  //! END @TODO1
})
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();