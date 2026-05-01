package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
	AllowOrigin string
	Env         string
}

func Load() *Config {
	_ = godotenv.Load()
	cfg := &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: mustEnv("DATABASE_URL"),
		AllowOrigin: getEnv("ALLOW_ORIGIN", "http://localhost:3000"),
		Env:         getEnv("APP_ENV", "development"),
	}
	return cfg
}

func getEnv(k, fallback string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return fallback
}

func mustEnv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Fatalf("missing required env var: %s", k)
	}
	return v
}
