package app.vx.dgtuhack2025;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class DgtuHack2025Application {

    public static void main(String[] args) {
        SpringApplication.run(DgtuHack2025Application.class, args);
    }

}
