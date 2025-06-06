# Escalabilidade e Performance

## Auto-Scaling Horizontal

**Definição:**
Auto-scaling horizontal é a capacidade de aumentar ou diminuir automaticamente o número de instâncias do serviço conforme a demanda, distribuindo a carga entre elas.

### Como aplicar no serviço .NET:
1. **Containerize** o serviço (ex: Docker).
2. **Hospede** em uma plataforma que suporte auto-scaling (Kubernetes, AWS ECS, Azure App Service, Google Cloud Run, etc).
3. **Configure métricas de escala** (CPU, memória, fila de requisições, etc).
4. **Defina políticas de scaling** (ex: "se CPU > 70% por 5 minutos, adicione uma instância").

#### Exemplo com Kubernetes (Horizontal Pod Autoscaler):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: investapp-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: investapp
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Vantagens:**
- Responde automaticamente ao aumento de carga.
- Reduz custos em períodos de baixa demanda.
- Alta disponibilidade.

---

## Estratégias de Balanceamento de Carga

### 1. Round-Robin
- Distribui as requisições de forma sequencial entre as instâncias (A, B, C, A, B, C...).
- **Vantagens:** Simples, fácil de implementar, funciona bem quando as instâncias têm performance semelhante.
- **Desvantagens:** Não considera o tempo de resposta real de cada instância. Se uma instância estiver lenta, ela continuará recebendo requisições.

### 2. Por Latência (Least Response Time)
- O balanceador monitora o tempo de resposta de cada instância e direciona novas requisições para as mais rápidas.
- **Vantagens:** Melhora a experiência do usuário, pois evita instâncias sobrecarregadas ou lentas.
- **Desvantagens:** Mais complexo de implementar, exige monitoramento contínuo e pode gerar overhead de controle.

---

### Comparação Prática

| Critério                | Round-Robin                | Por Latência                  |
|-------------------------|----------------------------|-------------------------------|
| Simplicidade            | Alta                       | Média/Baixa                   |
| Eficiência em cargas    | Boa (se instâncias iguais) | Excelente (adapta à realidade)|
| Tolerância a lentidão   | Baixa                      | Alta                          |
| Overhead de controle    | Baixo                      | Médio/Alto                    |
| Uso típico              | Sistemas homogêneos        | Sistemas com variação de carga|

---

**Resumo:**
- Use **round-robin** para sistemas simples, homogêneos e previsíveis.
- Use **balanceamento por latência** para máxima performance e experiência, especialmente quando as instâncias podem variar de desempenho. 