# Pjesa B - Electronic Online Shop ML

Ky folder permban pjesen time te projektit per parashikimin e `DemandLevel` dhe analizen e grupeve ne dataset-in Electronic Online Shop.

## Cka ka brenda

- `src/pipeline_dyqani_elektronik.py` - pipeline kryesor me preprocessing, modele klasifikimi dhe clustering.
- `notebooks/analiza_dyqani_elektronik_pjesa_b.ipynb` - notebook per ekzekutim dhe prezantim te rezultateve.
- `tasks/` - file te ndara sipas detyrave 1-11.
- `reports/Raporti_Final_Dyqani_Elektronik.docx` - raporti final per dorezim.
- `reports/Raporti_Final_Dyqani_Elektronik.md` - version tekst i raportit.
- `requirements.txt` - librarite e nevojshme.

## Detyrat e perfshira

1. Logistic Regression per `DemandLevel`
2. Neural Network Architecture 1 me 50 neurone
3. Neural Network Architecture 2 me 100 dhe 50 neurone
4. GridSearchCV per neural network
5. K-Means Clustering per K=2 deri K=6
6. Elbow Method dhe Silhouette Score
7. Krahasimi i clusters me `DemandLevel`
8. Tabela finale e krahasimit te modeleve
9. README
10. requirements.txt
11. Raporti final

## Si ekzekutohet

Vendose dataset-in ketu:

```text
data/electronic_online_shop.csv
```

Pastaj instalo librarite:

```bash
pip install -r requirements.txt
```

Hape notebook-un:

```bash
jupyter notebook notebooks/analiza_dyqani_elektronik_pjesa_b.ipynb
```

Ose ekzekuto pipeline-in direkt:

```bash
python src/pipeline_dyqani_elektronik.py
```

## Rezultatet

Pas ekzekutimit krijohen tabela dhe figura ne folderin `outputs/`, perfshire:

- krahasimin final te modeleve
- confusion matrices
- rezultatet e GridSearchCV
- elbow curve
- silhouette score
- PCA visualization per K-Means
- heatmap per krahasimin cluster-label

## Shenim

Nese mungon dataset-i zyrtar, kodi krijon nje sample dataset vetem per testim te workflow-it. Per dorezim final duhet te perdoret dataset-i real i projektit.
