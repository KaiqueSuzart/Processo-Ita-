using Confluent.Kafka;
using System.Text.Json;

public class ProducerTest
{
    public static async Task EnviarCotacaoTesteAsync(string bootstrapServers, string topic)
    {
        var config = new ProducerConfig { BootstrapServers = bootstrapServers };
        var cotacao = new
        {
            AtivoId = 1,
            PrecoUnitario = 25.50m,
            DataHora = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss")
        };
        var json = JsonSerializer.Serialize(cotacao);

        using var producer = new ProducerBuilder<Null, string>(config).Build();
        var result = await producer.ProduceAsync(topic, new Message<Null, string> { Value = json });
        Console.WriteLine($"Mensagem enviada para {topic}: {json}");
    }
} 