using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AureliaBase.Azure.Api.Extensions;
using AureliaBase.Azure.Api.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Newtonsoft.Json;

namespace AureliaBase.Azure.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    public class AppSettingsController : Controller
    {
        private const string BLOB_CONTAINER_NAME = "test-container";
        private const string SPA_SETTINGS_FILENAME = "spa-settings.json";

        private readonly AzureBlobStorageOptions blobStorageOptions;
        private bool isLoadingSettings;
        private bool isFailed;
        private AppSettings cachedAppSettings;

        public AppSettingsController(IOptions<AzureBlobStorageOptions> options)
        {
            this.blobStorageOptions = options.Value;
            this.isLoadingSettings = true;
            this.isFailed = false;
            LoadAppSettings();
        }

        [HttpGet]
        public IActionResult Get()
        {
            if (this.blobStorageOptions == null || this.blobStorageOptions.ConnectionStrings == null || this.blobStorageOptions.ConnectionStrings.Length <= 0) return StatusCode((int)System.Net.HttpStatusCode.InternalServerError);
            if (this.isLoadingSettings) return StatusCode((int)System.Net.HttpStatusCode.ServiceUnavailable);
            return Ok(this.cachedAppSettings);
        }

        private async void LoadAppSettings()
        {
            if (this.blobStorageOptions == null || this.blobStorageOptions.ConnectionStrings == null || this.blobStorageOptions.ConnectionStrings.Length <= 0)
            {
                this.isFailed = true;
                this.isLoadingSettings = false;
                return;
            }

            try
            {
                var csa = CloudStorageAccount.Parse(this.blobStorageOptions.ConnectionStrings[0]);
                var bc = csa.CreateCloudBlobClient();
                var containerRef = bc.GetContainerReference(BLOB_CONTAINER_NAME);
                await containerRef.CreateIfNotExistsAsync();
                var blobRef = containerRef.GetBlobReference(SPA_SETTINGS_FILENAME);
                bool exists = await blobRef.ExistsAsync();
                if (!exists)
                {
                    var blockBlobRef = containerRef.GetBlockBlobReference(SPA_SETTINGS_FILENAME);
                    var newSettings = new AppSettings();
                    await blockBlobRef.UploadTextAsync(JsonConvert.SerializeObject(newSettings));
                    this.cachedAppSettings = newSettings;
                }
                else
                {
                    using (var ms = new MemoryStream())
                    {
                        await blobRef.DownloadToStreamAsync(ms);
                        ms.Seek(0, SeekOrigin.Begin);
                        using (var sr = new StreamReader(ms))
                        {
                            var data = sr.ReadToEnd();
                            this.cachedAppSettings = JsonConvert.DeserializeObject<AppSettings>(data);
                        }
                    }
                }
                this.isLoadingSettings = false;
            }
            catch (Exception ex)
            {
                this.isFailed = true;
                this.isLoadingSettings = false;
                this.cachedAppSettings = null;
                throw;
            }
        }

    }
}
