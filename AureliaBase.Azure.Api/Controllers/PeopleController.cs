using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AureliaBase.Azure.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class PeopleController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(SampleData.PeopleList);
        }
    }
}
