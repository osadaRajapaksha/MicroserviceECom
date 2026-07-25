package com.microservice.product_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.microservice.product_service.repository.ProductRepository;
import com.microservice.product_service.model.Product;
import java.math.BigDecimal;

@SpringBootApplication
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

	@Bean
	public CommandLineRunner loadData(ProductRepository productRepository) {
		return args -> {
			if (productRepository.count() == 0) {
				Product p1 = new Product();
				p1.setName("iPhone 15 Pro");
				p1.setDescription("Latest Apple smartphone with titanium frame.");
				p1.setPrice(new BigDecimal("999.00"));

				Product p2 = new Product();
				p2.setName("Samsung Galaxy S24");
				p2.setDescription("Samsung's flagship Android device with AI.");
				p2.setPrice(new BigDecimal("899.00"));

				Product p3 = new Product();
				p3.setName("Sony WH-1000XM5");
				p3.setDescription("Industry leading noise canceling headphones.");
				p3.setPrice(new BigDecimal("348.00"));

				productRepository.save(p1);
				productRepository.save(p2);
				productRepository.save(p3);
			}
		};
	}

}
