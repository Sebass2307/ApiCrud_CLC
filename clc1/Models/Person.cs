using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApiPerson.Models
{
    public class Person
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public required string Name { get; set; }
        public required int Age { get; set; }
        public required int Rut { get; set; }

        [StringLength(1, ErrorMessage = "Digito Verificador solo puede ser de un caracter.")]
        [RegularExpression(@"^[0-9Kk]$", ErrorMessage = "Digito Verificador debe ser un número entre 0 y 9 o la letra 'K'.")]
        public required string Dv { get; set; }

        [Required]
        [RegularExpression("^(M|F|Otro)$", ErrorMessage = "Sexo solo debe ser 'M', 'F', u 'Otro'")]
        public required string Sexo { get; set; }

        public required string Prev_Salud { get; set; }
        public required int Telefono { get; set; }
        public required string Correo { get; set; }
        public required DateTime Fecha_Ingreso { get; set; }
    }

}
