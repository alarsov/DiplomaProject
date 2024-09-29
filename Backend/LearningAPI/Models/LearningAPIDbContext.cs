using Microsoft.EntityFrameworkCore;

namespace LearningAPI.Models
{
    public class LearningAPIDbContext : DbContext
    {
        public LearningAPIDbContext(DbContextOptions<LearningAPIDbContext> options) : base(options)
        {
            
        }

        public DbSet<UserRegistrationModel> Registration { get; set; }
        public DbSet<UploadFileModel> UploadFiles { get; set; }
        public DbSet<QuizDataModel> QuizResult {  get; set; }
        public DbSet<ReportModel> ReportResult { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UploadFileModel>(entity =>
            {
                entity.Property(e => e.FileContent)
                    .HasColumnType("text");

                entity.Property(e => e.SummarizedContent)
                    .HasColumnType("text");
            });
            modelBuilder.Entity<QuizDataModel>(entity =>
            {
                entity.Property(e => e.SelectedMaterials)
                .HasConversion(
                    v => string.Join(',', v),
                    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList())
                .HasColumnType("text");
            });

        }
    }
}
