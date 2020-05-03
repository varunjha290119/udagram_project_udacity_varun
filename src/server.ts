import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  function validateURL(userInput: string) {
    //coppied first line from https://stackoverflow.com/a/30971061/8449116
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery, "i");
    return url.test(userInput);
  }


  app.get("/filteredimage", async (req, res) => {

    //validating url

    // req is used to handle user response and send it to server
    // res is used to handle server response and send it to user
    // console.log(req);
    // console.log(res);

    var image_url = req.query.image_url;
    var isUrlOFImageValid = validateURL(image_url);

    if (isUrlOFImageValid){
      //call filterImageFromURL(image_url) to filter the image
      var pathOfImage = await filterImageFromURL(image_url);

      var options = {
        dotfiles: 'deny',
        header: {
          'x-timestamp':Date.now(),
          'x-sent': true
        }
      };
      // send the result file in response
      res.sendFile(pathOfImage, options, function (err) {
        if (err) {
          res.status(400).send('Unable to access image! some bad request has happened please check again')
        } else {
          deleteLocalFiles([pathOfImage])
        }
      });
    } else {
      res.status(404).send('Unable to find the url of image!')
    }
  })
  //! END @TODO1
  
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
