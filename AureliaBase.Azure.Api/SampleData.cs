using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AureliaBase.Azure.Api
{
    public static class SampleData
    {
        public static List<object> PeopleList = new List<object>()
        {
            new
            {
                Name = "Master Yoda",
                Email = "master@yoda.com",
                Id = 1
            },
            new
            {
                Name = "Luke Skywalker",
                Email = "luke@skywalker.com",
                Id = 2
            },
            new
            {
                Name = "Darth Vader",
                Email = "darth@vader.com",
                Id = 3
            },
            new
            {
                Name = "Leia Organa",
                Email = "leia@organa.com",
                Id = 4
            },
        };
    }
}
