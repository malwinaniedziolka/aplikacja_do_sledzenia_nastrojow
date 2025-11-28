# Aplikacja do sledzenia nastrojow

### **Opis**
Celem projektu jest stworzenie aplikacji do codziennego śledzenia nastrojów użytkownika. Aplikacja pozwala użytkownikowi na szybkie i proste dodanie wpisu związanego z jego samopoczuciem danego dnia. Każdy wpis zawiera wybór emocji, krótki opis dnia oraz ocenę od 0 do 5, co pozwala na bardziej szczegółowe spojrzenie na to, jak dany dzień był odczuwany. Dzięki statystykom użytkownik ma możliwość porównywać swoje emocje, co może pomóc w lepszym ich zrozumieniu i zauważeniu ewentualnych wzorców w samopoczuciu. 

### **Funkcjonalności**
- Wybieranie emocji którą się czuje danego dnia
- Opis dnia
- Ocena dnia od 0 do 5
- Edycja i usuwanie wpisów
- Możliwość przeglądania wcześniej dodanych wpisów
- Statystyki tygodniowe, miesięczne i roczne

### **Instrukcja uruchomienia aplikacji**
1. Zainstaluj Node.js, jeśli go jeszcze nie posiadasz lub zaktualizuj go do nowej wersji (v22 lub nowsza)
2. Zklonuj repozytorium poleceniem (w terminalu): git clone https://github.com/malwinaniedziolka/aplikacja_do_sledzenia_nastrojow
3. Otwórz aplikację w dowolnym edytorze kodu (np. Visual Studio Code)
4. Otwórz terminal i po wejściu w odpowiedni katalog w którym jest aplikacja wpisz 'npm install' - zainstaluje to potrzebne biblioteki do odpalenia aplikacji
5. Napisz w terminalu komendę 'npm start', co odpali aplikacje i stworzy twoją prywatną bazę danych
6. Otwórz przeglądarkę internetową i przejdź na stronę pod adresem http://localhost:3002

### **Wykorzystane biblioteki zewnętrzne**
- express ^5.1.0
- nodemon ^3.1.10 
- ejs ^3.1.10 
- body-parser ^2.2.0 
- dotenv ^17.2.3
- pg ^8.16.3
