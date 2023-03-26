# How to use gcloud

## gcloud を用いて、開発環境のfirestoreのデータを削除し、本番環境のfirestore のデータで洗い替え

```
gcloud firestore delete --all-collections --project [dev-project-id]
```

```
gcloud firestore export gs://[bucket-name] --project [prod-project-id]
```

```
gcloud firestore import gs://[bucket-name]/[export-folder] --project [dev-project-id]
```

※ 現在の調査では、別プロジェクトからアクセス権限がないため、手動で移動させた。
