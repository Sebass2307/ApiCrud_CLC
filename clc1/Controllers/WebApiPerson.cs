using Microsoft.AspNetCore.Mvc;
using WebApiPerson.Context;
using WebApiPerson.Models;

namespace WebApiPerson.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonController(AppDbContext context)
        {
            _context = context;
        }

        // CREATE
        [HttpPost]
        public IActionResult CreatePerson([FromBody] Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Persons.Add(person);
            _context.SaveChanges();
            return Ok(person);
        }


        // READ ALL
        [HttpGet]
        public IActionResult GetAllPersons()
        {
            var persons = _context.Persons.ToList();
            return Ok(persons);
        }

        // READ BY ID
        [HttpGet("{id}")]
        public IActionResult GetPersonById(int id)
        {
            var person = _context.Persons.Find(id);
            if (person == null) return NotFound();
            return Ok(person);
        }

        // READ BY NAME
        [HttpGet("search")]
        public IActionResult GetPersonByName(string name)
        {
            var persons = _context.Persons.Where(p => p.Name.Contains(name)).ToList();
            if (!persons.Any()) return NotFound();
            return Ok(persons);
        }

        // READ BY RUT
        [HttpGet("searchByRut")]
        public IActionResult GetPersonByRut(string rut)
        {
            var persons = _context.Persons
                .Where(p => p.Rut.ToString().Contains(rut))
                .ToList();
            if (!persons.Any()) return NotFound();
            return Ok(persons);
        }



        // UPDATE
        [HttpPut("{id}")]
        public IActionResult UpdatePerson(int id, [FromBody] Person person)
        {
            var existingPerson = _context.Persons.Find(id);
            if (existingPerson == null) return NotFound();

            existingPerson.Name = person.Name;
            existingPerson.Age = person.Age;
            existingPerson.Rut = person.Rut;
            existingPerson.Dv = person.Dv;
            existingPerson.Sexo = person.Sexo;
            existingPerson.Prev_Salud = person.Prev_Salud;
            existingPerson.Telefono = person.Telefono;
            existingPerson.Correo = person.Correo;
            existingPerson.Fecha_Ingreso = person.Fecha_Ingreso;
            _context.SaveChanges();
            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult DeletePerson(int id)
        {
            var person = _context.Persons.Find(id);
            if (person == null) return NotFound();

            _context.Persons.Remove(person);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
