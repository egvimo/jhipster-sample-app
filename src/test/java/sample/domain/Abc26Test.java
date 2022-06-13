package sample.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import sample.web.rest.TestUtil;

class Abc26Test {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Abc26.class);
        Abc26 abc261 = new Abc26();
        abc261.setId(1L);
        Abc26 abc262 = new Abc26();
        abc262.setId(abc261.getId());
        assertThat(abc261).isEqualTo(abc262);
        abc262.setId(2L);
        assertThat(abc261).isNotEqualTo(abc262);
        abc261.setId(null);
        assertThat(abc261).isNotEqualTo(abc262);
    }
}
