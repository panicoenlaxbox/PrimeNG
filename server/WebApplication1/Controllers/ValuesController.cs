using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Threading.Tasks;

namespace WebApplication1.Controllers
{
    public class ApiData<T>
    {
        public int TotalRecords { get; set; }
        public IEnumerable<T> Data { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<string> Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }

    public class LazyLoadEvent
    {
        public int First { get; set; }
        public int Rows { get; set; }
        public string SortField { get; set; }
        public SortOrder? SortOrder { get; set; }
        public IEnumerable<SortMeta> MultiSortMeta { get; set; }
        public string GlobalFilter { get; set; }
        public IDictionary<string, FilterMetadata> Filters { get; set; }
    }

    public class SortMeta
    {
        public string Field { get; set; }
        public SortOrder Order { get; set; }
    }

    public class FilterMetadata
    {
        public string Value { get; set; }
        //"startsWith", "contains", "endsWith", "equals", "notEquals", "in", "lt", "lte", "gt" and "gte"
        public string MatchMode { get; set; }
    }



    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MyContext _context;

        public UsersController(MyContext context)
        {
            _context = context;
        }
        // GET api/users
        [HttpGet]
        public async Task<ActionResult<ApiData<User>>> Get([FromQuery] LazyLoadEvent lazyLoadEvent)
        {
            IQueryable<User> q = _context.Users;
            if (lazyLoadEvent.Filters != null)
            {
                foreach (var filterMetadata in lazyLoadEvent.Filters)
                {
                    if (filterMetadata.Key == "global" && filterMetadata.Value.MatchMode == "contains")
                    {
                        var value = filterMetadata.Value.Value;
                        q = q.Where(u =>
                            u.Name.Contains(value) ||
                            u.Company.Contains(value) ||
                            u.Email.Contains(value) ||
                            u.Phone.Contains(value) ||
                            u.Address.Contains(value));
                    }
                    else if (filterMetadata.Key == "id" && filterMetadata.Value.MatchMode == "equals")
                    {
                        q = q.Where(u => u.Id == Convert.ToInt32(filterMetadata.Value.Value));
                    }
                }
            }
            if (lazyLoadEvent.MultiSortMeta != null)  // sortMode = "multiple"
            {
                var sort = "";
                foreach (var sortMeta in lazyLoadEvent.MultiSortMeta)
                {
                    sort += $"{sortMeta.Field} {sortMeta.Order.ToString().ToLower()}, ";
                }
                sort = sort.Substring(0, sort.Length - ", ".Length);
                q = q.OrderBy(sort);
            }
            else if (!string.IsNullOrWhiteSpace(lazyLoadEvent.SortField)) // sortMode = "single"
            {
                var sort = $"{lazyLoadEvent.SortField} {(lazyLoadEvent.SortOrder == null ? "ascending" : lazyLoadEvent.SortOrder.ToString().ToLower())}";
                q = q.OrderBy(sort);
            }

            //await Task.Delay(500);

            return new ApiData<User>()
            {
                TotalRecords = await _context.Users.CountAsync(),
                Data = await q.Skip(lazyLoadEvent.First).Take(lazyLoadEvent.Rows).ToListAsync()
            };
        }

        // DELETE api/users/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> Delete([FromRoute] int id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

       
    }
}
