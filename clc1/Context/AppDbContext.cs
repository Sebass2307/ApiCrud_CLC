using Microsoft.EntityFrameworkCore;
using WebApiPerson.Models;

namespace WebApiPerson.Context
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Person> Persons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Person>(entity =>
            {
                entity.ToTable("Person");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.Age)
                      .HasColumnType("NUMBER(3,0)");
                entity.Property(e => e.Rut)
                      .HasColumnType("NUMBER(8,0)");
                entity.Property(e => e.Telefono)
                      .HasColumnType("NUMBER(9,0)");

                entity.Property(e => e.Name)
                      .HasMaxLength(50);

                entity.Property(e => e.Prev_Salud)
                      .HasMaxLength(50);

                entity.Property(e => e.Correo)
                      .HasMaxLength(50);

                entity.Property(e => e.Dv)
                      .HasMaxLength(1); 

                entity.Property(e => e.Sexo)
                      .HasMaxLength(4)
                      .IsRequired()
                      .HasDefaultValue("Otro"); 

            });
        }
    }
}
