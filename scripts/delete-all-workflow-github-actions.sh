#!/bin/sh

user="user" repo=barcode-reader-zbar-webassembly
gh api repos/$user/$repo/actions/runs \
	--paginate -q '.workflow_runs[] | select(.head_branch != "master1:wq") | "\(.id)"' |
	xargs -n1 -I % gh api repos/$user/$repo/actions/runs/% -X DELETE
