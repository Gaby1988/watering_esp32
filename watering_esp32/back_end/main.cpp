#include <Arduino.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>

const char *ssid = "********";
const char *password = "********";

const int pompes[] = {12, 14};
const int capteursHumidite[] = {34, 35};

AsyncWebServer server(80);
AsyncWebSocket ws("/ws");

bool etatPompes[sizeof(pompes) / sizeof(pompes[0])] = {false};

void informerClients()
{
  String message = "État des pompes : ";
  for (int i = 0; i < sizeof(pompes) / sizeof(pompes[0]); i++)
  {
    message += "Pompe " + String(i + 1) + " : " + (etatPompes[i] ? "activée" : "désactivée") + " | ";
  }
  ws.textAll(message);
}

void onWsEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  Serial.println("test WebSocket");
}

void setup()
{
  Serial.begin(115200);

  for (int i = 0; i < sizeof(pompes) / sizeof(pompes[0]); i++)
  {
    pinMode(pompes[i], OUTPUT);
    digitalWrite(pompes[i], LOW);
    pinMode(capteursHumidite[i], INPUT);
  }

  if (!SPIFFS.begin())
  {
    Serial.println("Erreur SPIFFS...");
    return;
  }

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\n");
  Serial.println("Connexion établie!");
  Serial.print("Adresse IP:");
  Serial.println(WiFi.localIP());
  ws.onEvent(onWsEvent);
  server.addHandler(&ws);

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/dist/index.html", "text/html"); });

  server.on("/assets/style.css", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/dist/assets/style.css", "text/css"); });

  server.on("/assets/script.js", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(SPIFFS, "/dist/assets/script.js", "text/javascript"); });

  server.on("/informer", HTTP_GET, [](AsyncWebServerRequest *request)
            {
    int pumps = sizeof(pompes) / sizeof(pompes[0]);
    String numberPumps = String(pumps);
    request->send(200,"text/plain", numberPumps); });

  for (int i = 0; i < sizeof(pompes) / sizeof(pompes[0]); i++)
  {
    char route[30];
    sprintf(route, "/lireHumidite-%d", i);
    server.on(route, HTTP_GET, [i](AsyncWebServerRequest *request)
              {
    int val = analogRead(capteursHumidite[i]);
    String humidite = String(val);
    request->send(200, "text/plain", humidite); });
    sprintf(route, "/activerPompe-%d", i);
    server.on(route, HTTP_GET, [i](AsyncWebServerRequest *request)
              {
                digitalWrite(pompes[i], HIGH);
                etatPompes[i] = true;
                informerClients();
                Serial.println("Pompe " + String(i) + " activée !");
                request->send(200, "text/plain", "OK"); 
              });
    sprintf(route, "/desactiverPompe-%d", i);
    server.on(route, HTTP_GET, [i](AsyncWebServerRequest *request)
              {
                digitalWrite(pompes[i], LOW);
                etatPompes[i] = false;
                informerClients();
                Serial.println("Pompe " + String(i) + " désactivée !");
                request->send(200, "text/plain", "OK"); 
              });
  }

  server.begin();
}
void loop() {
  
}