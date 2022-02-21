using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Host.DBEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace MongoDB.Host.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [RoutePrefix("api/values")]
    public class ValuesController : ApiController
    {
        // GET api/values
        [HttpGet]
        [Route("GetAllUsers")]
        public IEnumerable<User> GetAllUsers(bool showActiveUser = false)
        {
            // Mongo DB Client Connection
            var client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
            // Database Access
            var database = client.GetDatabase("DB_TEST");
            // Get the User Collection from DB
            var userCollection = database.GetCollection<User>("Users");

            // Get the filtered data from Users Collaction
            var data = userCollection.Find(x => x.IsActive == showActiveUser).ToList();
            return data;
        }

        [HttpGet]
        [Route("GetUserByID")]
        public IHttpActionResult GetUserByID(string userID)
        {
            // Mongo DB Client Connection
            var client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
            // Database Access
            var database = client.GetDatabase("DB_TEST");
            // Get the User Collection from DB
            var userCollection = database.GetCollection<User>("Users");

            ObjectId uid = MongoDB.Bson.ObjectId.Parse(userID);


            var data = userCollection.Find(x => x._id == uid).FirstOrDefault();

            return Ok(data);

        }

        [HttpPost]
        [Route("SaveUser")]
        public async Task<IHttpActionResult> SaveUser(EditUserModal data)
        {
            // Mongo DB Client Connection
            var client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
            // Database Access
            var database = client.GetDatabase("DB_TEST");
            // Get the User Collection from DB
            var userCollection = database.GetCollection<User>("Users");

            if (string.IsNullOrEmpty(data.UserID))
            {
                //data.user.IsActive = true;
                await userCollection.InsertOneAsync(data.user);
            }
            else
            {
                ObjectId uid = MongoDB.Bson.ObjectId.Parse(data.UserID);
                data.user._id = uid;
                var filter = Builders<User>.Filter.Eq(s => s._id, uid);
                var result = await userCollection.ReplaceOneAsync(filter, data.user);

            }
            return Ok();

        }

        [HttpGet]
        [Route("DeleteUser")]
        public async Task<IHttpActionResult> DeleteUser(string userID)
        {
            // Mongo DB Client Connection
            var client = new MongoClient("mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false");
            // Database Access
            var database = client.GetDatabase("DB_TEST");
            // Get the User Collection from DB
            var userCollection = database.GetCollection<User>("Users");

            ObjectId uid = MongoDB.Bson.ObjectId.Parse(userID);

            var filter = Builders<User>.Filter.Eq(s => s._id, uid);

            var relutt = await userCollection.DeleteOneAsync(filter);

            return Ok();

        }
    }
}
