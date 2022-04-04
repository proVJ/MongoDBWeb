using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MongoDB.Host.DBEntities
{
    public class User
    {
        //[BsonId]
        public BsonObjectId _id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Phone { get; set; }
        public string UserType { get; set; }
        public string Role { get; set; }
        public string DatabaseAccess { get; set; }
        public bool IsActive { get; set; }


    }
}