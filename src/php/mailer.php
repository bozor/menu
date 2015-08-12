<?php
 
    class GoogleRecaptcha 
    {
        /* Google recaptcha API url */
        private $google_url = "https://www.google.com/recaptcha/api/siteverify";
        private $secret = '6LdRIQsTAAAAALoGaGEVVANp7uI4rHPEmespfav0';
     
        public function VerifyCaptcha($response)
        {
            $url = $this->google_url."?secret=".$this->secret."&response=".$response;
     
            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($curl, CURLOPT_TIMEOUT, 15);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, FALSE);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, FALSE); 
            $curlData = curl_exec($curl);
     
            curl_close($curl);
     
            $res = json_decode($curlData, TRUE);
            if($res['success'] == 'true') 
                return TRUE;
            else
                return FALSE;
        }
     
    }
    
    function sendEmail(){
        $mail_from = "website@test.com";
        $mail_to = "boris.grudinin@gmail.com";
        $mail_subject = "Cotnact from website";
        $form_name = $_POST['form-name'];
        $body = "Hello,\nA user has contacted you through the website.\n\nThis is an automated email, please do not reply to it.\n\n";
        $headers = "From: $mail_from" . "\n" . "Reply-To: $mail_from" . "\n" . "X-Mailer: PHP/" . phpversion();

        $body .= "Country: " . $_POST["form-country"];

        echo $body; 

        /*if ( mail($mail_to, $mail_subject, $message, $headers) ) {
            echo "<div class=\"success\"><h2>Thank you</h2><p>One of our representatives will be in touch shortly.</p></div>";
        } else {
            echo "<div class=\"error\"><h2>Error</h2><p>We are sorry but something went wrong. Please try again later.</p></div>";
        }*/
    }

    $message = '';
     
    if($_SERVER["REQUEST_METHOD"] == "POST")
    {
        $response = $_POST['g-recaptcha-response'];
     
        if(!empty($response))
        {
            $cap = new GoogleRecaptcha();
            $verified = $cap->VerifyCaptcha($response);

            if($verified) {
                sendEmail();
            } else {
                $message = "Please reenter captcha";
            }
        } 
        else
        {
            $message = "Please reenter captcha";
        }

        echo $message;
    }
 
?>