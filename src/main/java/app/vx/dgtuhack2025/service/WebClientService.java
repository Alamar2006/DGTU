package app.vx.dgtuhack2025.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class WebClientService {

    private final WebClient webClient;

    public WebClientService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://jsonplaceholder.typicode.com").build();
    }

    public WebClientService () {
        webClient = null;
    }

    public void sendRequests() {
        // POST запрос
        String requestBody = "{\"title\": \"foo\", \"body\": \"bar\", \"userId\": 1}";

        Mono<String> response3 = webClient.post()
                .uri("/posts")
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class);
    }
}
