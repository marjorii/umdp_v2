# PRÉ-REQUIS

Un modèle de Raspberry Pi 3B+ min.  
Liste exhaustive du matériel, tutoriels :  
https://libreto.sans-nuage.fr/glassbox/

# INSTALLATION

```bash
# Ouvrir un terminal.
git clone https://github.com/marjorii/umdp_v2.git
# Se déplacer dans le dossier "umdp_v2" :
cd /home/pi/dev/umdp_v2/
# Créer un environnement virtuel
python3 -m venv venv
# Installer les dépendances suivantes :
pip install RPLCD
pip install selenium
# Télécharger chromedriver et le mettre dans un dossier nommé "async"
```

# DEV

```bash
# Ouvrir un terminal.
# Se déplacer dans le dossier "umdp_v2" :
cd /home/pi/dev/umdp_v2/
# Lancer un serveur :
python3 -m http.server
# Ouvrir une autre fenêtre du terminal.
# Lancer l'environnement virtuel (au même emplacement que le serveur) :
cd /home/pi/dev/umdp_v2/
source venv/bin/activate
# Lancer le programme :
python3 umdp.py
```
