# `npm publish`

## step

- update the `version` in `package.json`
- create `git` tag

```git
git tag -a x.x.x -m 'tag message'
```

- push tag

```git
git push origin x.x.x
```

- `publish`

```npm
npm publish
```

## `Git tag`

```shell
# get tags list
git tag

# create a tag with message
git tag -a 0.0.1 -m 'tag message'

# push tag to origin
git push origin 0.0.1

# push all tags in local
git push origin --tags

# delete local tag
git tag -d 0.0.1

# delete origin tag
git push origin :0.0.1
```

***
