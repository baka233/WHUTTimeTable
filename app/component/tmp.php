if (isset($header['HTTP_M_TEST']) {
    $user = $header['HTTP_M_TEST']
    $_SESSION['cardno'] = $user;
    $info = M('user')->where("`cardno` = '%s'", $user)->find();
}
