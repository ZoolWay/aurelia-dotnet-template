using System;

namespace AureliaBase.Azure.Api.Model
{
    public class AppSettings
    {
        public string DefaultLanguage { get; set; }
        public string DefaultTimeZone { get; set; }
        public Workspace[] Workspaces { get; set; }
    }
}
