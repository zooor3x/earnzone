# EarnZone — starter MVP

Polskojęzyczny, responsywny prototyp front-endu platformy nagród w minimalistycznym stylu dark mode z fioletowym akcentem.

## Co działa
- responsywna strona główna,
- przykładowe karty zadań i filtry kategorii,
- demonstracyjne punkty zapisywane w `localStorage` tej przeglądarki,
- przycisk logowania wyjaśniający status demo,
- resetowanie danych demo.

## Czego jeszcze NIE ma
Nie ma prawdziwych kont, serwera, bazy danych, panelu administratora, prawdziwych ofert ani wypłat. Punkty są fikcyjne i można je zmienić w przeglądarce. Nie zbieraj prawdziwych danych użytkowników w tej wersji.

## Uruchom lokalnie
Najprościej otwórz `index.html` w przeglądarce. Do testów można też użyć rozszerzenia Live Server w Visual Studio Code.

## Publikacja wersji demonstracyjnej
1. Załóż konto na GitHubie i utwórz repozytorium `earnzone`.
2. Wgraj `index.html`, `styles.css`, `app.js` oraz `README.md`.
3. Włącz GitHub Pages w ustawieniach repozytorium (Settings → Pages → Deploy from a branch → `main` → `/ (root)`).
4. Poczekaj na adres strony podany w ustawieniach Pages.

To nadaje się wyłącznie do publicznego demo, nie do komercyjnej platformy z wypłatami. Alternatywnie można wdrożyć frontend przez Vercel; sprawdź aktualne warunki planu, bo bezpłatny Hobby jest przeznaczony do użytku osobistego, nie komercyjnego.

## Plan dalszego rozwoju
1. GitHub + repozytorium i podgląd.
2. Supabase Auth + Postgres, polityki RLS i weryfikacja e-mail.
3. Serwerowy, niezmienny ledger punktów; nigdy nie ufaj punktom z przeglądarki.
4. Integracja partnera ofert przez serwerowe callbacki, podpisy, idempotencję i obsługę chargebacków.
5. Panel administratora, wykrywanie nadużyć, logi audytowe.
6. Proces wypłat po weryfikacji prawnej, biznesowej i akceptacji operatora.
7. Regulamin, polityka prywatności, zgody/cookies, proces obsługi praw użytkownika i procedury podatkowe.

## Zasady bezpieczeństwa
- Nie przechowuj haseł samodzielnie; użyj sprawdzonego dostawcy Auth.
- Klucze `service_role`, sekrety partnerów i klucze webhooków trzymaj wyłącznie w zmiennych środowiskowych serwera.
- Weryfikuj podpisy callbacków i zapisuj unikalny identyfikator transakcji, aby retry nie naliczał nagrody drugi raz.
- Użytkownika do callbacku przypisuj po identyfikatorze z własnej sesji; nie ufaj ID podanemu przez przeglądarkę.
- Przed uruchomieniem komercyjnym sprawdź regulacje w krajach działania oraz warunki każdego dostawcy.
