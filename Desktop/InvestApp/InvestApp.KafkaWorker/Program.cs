using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices(services =>
    {
        services.AddHostedService<Worker>();
    })
    .Build();

// Enviar mensagem de teste ao iniciar
var config = host.Services.GetRequiredService<IConfiguration>();
await ProducerTest.EnviarCotacaoTesteAsync(
    config["Kafka:BootstrapServers"],
    config["Kafka:Topic"]
);

await host.RunAsync(); 