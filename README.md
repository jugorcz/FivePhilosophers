# FivePhilosophers

**Problem pięciu filozofów**:  
 - Jest pięciu filozofów i pięć widelców
 - Każdy filozof zajmuje sie głownie myśleniem
 - Od czasu do czasu potrzebuje zjeść
 - Do jedzenia potrzebne mu są oba widelce po jego prawej i lewej stronie
 - Jedzenie trwa skończoną (ale nieokresloną z gory) ilość czasu, po czym   
   filozof widelce odkłada i wraca do myślenia
 - Cykl powtarza sie od początku

## Rozwiązania  

**Rozwiazanie trywialne**: każdy z filozofów podnosi najpierw prawy, a później lewy widelec.
Rozwiązanie prowadzi do blokady, gdy wszyscy filozofowie podniosą prawy widelec i czekają na lewy.  
**Rozwiązanie asymetryczne**: filozofowie z nieparzystym numerem najpierw podnoszą widelec lewy, z parzystym -- prawy.  
**Rozwiazanie z lokajem** (inaczej: kelnerem), który pilnuje, aby o widelce w tym samym czasie rywalizowało tylko 4 filozofów, pozostały czeka. O lokaju można myśleć, jak o dodatkowym semaforze licznikowym z wartością maksymalną N-1, gdzie N - liczba filozofów.

teoria współbieżności zadanie 8
