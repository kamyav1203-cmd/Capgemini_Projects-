namespace HospitalManagement.API.Helpers
{
    /*
        Maps JWT settings from appsettings.json
    */

    public class JwtSettings
    {
        public string Key { get; set; } = string.Empty;

        public string Issuer { get; set; } = string.Empty;

        public string Audience { get; set; } = string.Empty;

        public int DurationInMinutes { get; set; }
    }
}